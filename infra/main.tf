# -------------
# Root Level Terraform Configuration
# -------------
# Create the main resource group for all application resources
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.common_tags
  lifecycle {
    ignore_changes = [
      tags
    ]
  }
}

resource "azurerm_user_assigned_identity" "backend_user_assigned_identity" {
  location = azurerm_resource_group.main.location
  name = "backend-user-identity-${var.app_env}"
  resource_group_name = azurerm_resource_group.main.name
}

locals {
  # A user-assigned managed identity needs User Id=<client id> in the connection string so that the
  # SQL client selects it instead of the system-assigned identity.
  append_user_id = azurerm_user_assigned_identity.backend_user_assigned_identity.client_id 

  fabric_sql_connection_string = (
    local.append_user_id != "" && !can(regex("(?i)user id *=", var.fabric_sql_connection_string))
    ? "${trimsuffix(trimspace(var.fabric_sql_connection_string), ";")};User Id=${local.append_user_id}"
    : var.fabric_sql_connection_string
  )

  fabric_sql_connection_string_2 = (
    local.append_user_id != "" && var.fabric_sql_connection_string_2 != "" && !can(regex("(?i)user id *=", var.fabric_sql_connection_string_2))
    ? "${trimsuffix(trimspace(var.fabric_sql_connection_string_2), ";")};User Id=${local.append_user_id}"
    : var.fabric_sql_connection_string_2
  )
}

# -------------
# Modules based on Dependency
# -------------
module "network" {
  source = "./modules/network"

  common_tags              = var.common_tags
  resource_group_name      = azurerm_resource_group.main.name
  vnet_address_space       = var.vnet_address_space
  vnet_name                = var.vnet_name
  vnet_resource_group_name = var.vnet_resource_group_name

  depends_on = [azurerm_resource_group.main]
}

module "monitoring" {
  source = "./modules/monitoring"

  app_name                     = var.app_name
  common_tags                  = var.common_tags
  location                     = var.location
  log_analytics_retention_days = var.log_analytics_retention_days
  log_analytics_sku            = var.log_analytics_sku
  resource_group_name          = azurerm_resource_group.main.name

  depends_on = [azurerm_resource_group.main, module.network]
}

module "acr" {
  count  = var.enable_acr ? 1 : 0
  source = "./modules/acr"

  acr_name                      = var.acr_name
  location                      = var.location
  resource_group_name           = azurerm_resource_group.main.name
  common_tags                   = var.common_tags
  sku                           = var.acr_sku
  public_network_access_enabled = var.acr_public_network_access_enabled
  enable_private_endpoint       = var.acr_enable_private_endpoint
  private_endpoint_subnet_id    = module.network.private_endpoint_subnet_id
  log_analytics_workspace_id    = module.monitoring.log_analytics_workspace_id
  admin_enabled                 = var.acr_admin_enabled
  depends_on                    = [azurerm_resource_group.main, module.network, module.monitoring]
}


module "frontdoor" {
  source                         = "./modules/frontdoor"
  count                          = var.enable_frontdoor ? 1 : 0
  app_name                       = var.app_name
  common_tags                    = var.common_tags
  frontdoor_sku_name             = var.frontdoor_sku_name
  rate_limit_duration_in_minutes = var.rate_limit_duration_in_minutes
  rate_limit_threshold           = var.rate_limit_threshold
  resource_group_name            = azurerm_resource_group.main.name
  log_analytics_workspace_id     = module.monitoring.log_analytics_workspace_id

  depends_on = [azurerm_resource_group.main, module.network, module.monitoring]
}

module "frontend" {
  count  = var.enable_app_service_frontend ? 1 : 0
  source = "./modules/frontend"

  app_env                               = var.app_env
  app_name                              = var.app_name
  app_service_sku_name_frontend         = var.app_service_sku_name_frontend
  appinsights_connection_string         = module.monitoring.appinsights_connection_string
  appinsights_instrumentation_key       = module.monitoring.appinsights_instrumentation_key
  appinsights_resource_id               = module.monitoring.appinsights_resource_id
  common_tags                           = var.common_tags
  enable_frontdoor                      = var.enable_frontdoor
  vivid_cidr                            = var.vivid_cidr
  frontend_frontdoor_id                 = var.enable_frontdoor ? module.frontdoor[0].frontdoor_id : null
  frontend_frontdoor_resource_guid      = var.enable_frontdoor ? module.frontdoor[0].frontdoor_resource_guid : null
  frontend_image                        = var.frontend_image
  frontend_subnet_id                    = module.network.app_service_subnet_id
  frontdoor_frontend_firewall_policy_id = var.enable_frontdoor ? module.frontdoor[0].firewall_policy_id : null
  location                              = var.location
  log_analytics_workspace_id            = module.monitoring.log_analytics_workspace_id
  repo_name                             = var.repo_name
  resource_group_name                   = azurerm_resource_group.main.name
  resource_group_id                     = azurerm_resource_group.main.id
  # This is a runtime env var consumed by Caddy's reverse_proxy upstream in the frontend container.
  # Prefer Container Apps backend when enabled; otherwise fall back to the predictable App Service backend hostname.
  backend_url = var.enable_container_apps ? try(module.container_apps[0].backend_container_app_url, null) : "https://${var.repo_name}-${var.app_env}-api.azurewebsites.net"

  depends_on = [module.monitoring, module.network]
}

module "backend" {
  count  = var.enable_app_service_backend ? 1 : 0
  source = "./modules/backend"

  api_image                               = var.api_image
  download_api_image                      = var.download_api_image
  app_env                                 = var.app_env
  app_name                                = var.app_name
  app_service_sku_name_backend            = var.app_service_sku_name_backend
  app_service_subnet_id                   = module.network.app_service_subnet_id
  appinsights_connection_string           = module.monitoring.appinsights_connection_string
  appinsights_instrumentation_key         = module.monitoring.appinsights_instrumentation_key
  backend_subnet_id                       = module.network.app_service_subnet_id
  common_tags                             = var.common_tags
  enable_frontdoor                        = var.enable_frontdoor
  vivid_cidr                              = var.vivid_cidr
  fabric_sql_connection_string            = local.fabric_sql_connection_string
  fabric_sql_connection_string_2          = local.fabric_sql_connection_string_2
  user_assigned_identity_id               = azurerm_user_assigned_identity.backend_user_assigned_identity.id
  frontend_frontdoor_resource_guid        = var.enable_frontdoor ? module.frontdoor[0].frontdoor_resource_guid : null
  frontend_possible_outbound_ip_addresses = var.enable_app_service_frontend ? module.frontend[0].possible_outbound_ip_addresses : ""
  location                                = var.location
  log_analytics_workspace_id              = module.monitoring.log_analytics_workspace_id
  repo_name                               = var.repo_name
  resource_group_name                     = azurerm_resource_group.main.name
  resource_group_id                       = azurerm_resource_group.main.id

  datamart_timeout_seconds = var.datamart_timeout_seconds
  download_sync_threshold  = var.download_sync_threshold
  download_page_size = var.download_page_size


  depends_on = [module.frontend]
}

# API Management Module (optional)
module "apim" {
  count  = var.enable_apim ? 1 : 0
  source = "./modules/apim"

  app_name                           = var.app_name
  app_env                            = var.app_env
  location                           = var.location
  resource_group_name                = azurerm_resource_group.main.name
  common_tags                        = var.common_tags
  publisher_name                     = var.apim_publisher_name
  publisher_email                    = var.apim_publisher_email
  sku_name                           = var.apim_sku_name
  subnet_id                          = module.network.apim_subnet_id
  enable_diagnostic_settings         = var.apim_enable_diagnostic_settings
  log_analytics_workspace_id         = module.monitoring.log_analytics_workspace_id
  enable_application_insights_logger = var.apim_enable_application_insights_logger
  appinsights_instrumentation_key    = module.monitoring.appinsights_instrumentation_key

  # Backend services configuration - connect to the deployed backend
  backend_services = {
    "backend-api" = {
      protocol    = "http"
      url         = var.enable_app_service_backend ? "https://${module.backend[0].backend_url}" : var.enable_container_apps ? "http://${module.container_apps[0].backend_container_app_url}" : ""
      description = "Backend API service"
      title       = "Backend API"
    }
  }

  depends_on = [module.network, module.monitoring, module.backend]
}

# Container Apps Module (optional alongside App Service)
module "container_apps" {
  count                           = var.enable_container_apps ? 1 : 0
  source                          = "./modules/container-apps"
  appinsights_connection_string   = module.monitoring.appinsights_connection_string
  appinsights_instrumentation_key = module.monitoring.appinsights_instrumentation_key
  app_name                        = var.app_name
  app_env                         = var.app_env
  location                        = var.location
  resource_group_name             = azurerm_resource_group.main.name
  common_tags                     = var.common_tags
  container_apps_subnet_id        = module.network.container_apps_subnet_id
  log_analytics_workspace_id      = module.monitoring.log_analytics_workspace_id
  backend_image                   = var.api_image
  fabric_sql_connection_string    = local.fabric_sql_connection_string
  user_assigned_identity_id       = azurerm_user_assigned_identity.backend_user_assigned_identity.id
  # Avoid referencing module.frontend here to prevent a dependency cycle.
  # Frontend App Service hostname is deterministic: <repo>-<env>-frontend.azurewebsites.net
  # Front Door endpoint hostname is also deterministic: <repo>-<env>-frontend-fd.azurefd.net
  app_service_frontend_url = var.enable_app_service_frontend ? (
    var.enable_frontdoor
    ? "https://${var.repo_name}-${var.app_env}-frontend-fd.azurefd.net"
    : "https://${var.repo_name}-${var.app_env}-frontend.azurewebsites.net"
  ) : ""
  container_cpu                       = var.container_apps_cpu
  container_memory                    = var.container_apps_memory
  min_replicas                        = var.container_apps_min_replicas
  max_replicas                        = var.container_apps_max_replicas
  private_endpoint_subnet_id          = module.network.private_endpoint_subnet_id
  enable_system_assigned_identity     = true
  log_analytics_workspace_customer_id = module.monitoring.log_analytics_workspace_workspaceId
  log_analytics_workspace_key         = module.monitoring.log_analytics_workspace_key

  depends_on = [module.network, module.monitoring]
}

module "app_alerting" {
  source = "./modules/app-alerting"

  app_name                              = var.app_name
  resource_group_name                   = azurerm_resource_group.main.name
  location                              = var.location
  common_tags                           = var.common_tags
  enable_alerts                         = var.enable_application_alerts
  alert_emails                          = var.application_alert_emails
  application_insights_id               = module.monitoring.appinsights_resource_id
  log_analytics_workspace_id            = module.monitoring.log_analytics_workspace_id
  enable_app_service_backend            = var.enable_app_service_backend
  enable_container_apps_backend         = var.enable_container_apps
  app_service_backend_id                = try(module.backend[0].backend_app_service_id, null)
  container_app_id                      = try(module.container_apps[0].backend_container_app_id, null)
  runtime_issue_log_threshold           = var.application_runtime_issue_alert_threshold
  database_connectivity_issue_threshold = var.application_database_issue_alert_threshold
  backend_http_5xx_threshold            = var.backend_http_5xx_alert_threshold
  app_service_http_5xx_threshold        = var.app_service_http_5xx_alert_threshold
  container_app_restart_threshold       = var.container_app_restart_alert_threshold

  depends_on = [module.monitoring, module.backend, module.container_apps]
}

