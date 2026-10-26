# -------------
# Common Variables for Azure Infrastructure
# -------------

variable "api_image" {
  description = "The image for the API container"
  type        = string
}

variable "download_api_image" {
  description = "The image for the Download API container"
  type        = string
}

variable "app_env" {
  description = "Application environment (dev, test, prod)"
  type        = string
}

variable "app_name" {
  description = "Name of the application"
  type        = string
}

variable "app_service_sku_name_backend" {
  description = "SKU name for the backend App Service Plan"
  type        = string
  default     = "B1" # Basic tier 
}

variable "app_service_sku_name_frontend" {
  description = "SKU name for the frontend App Service Plan"
  type        = string
  default     = "B1" # Basic tier 
}

variable "client_id" {
  description = "Azure client ID for the service principal"
  type        = string
  sensitive   = true

  validation {
    condition     = can(regex("^[0-9a-fA-F-]{36}$", var.client_id))
    error_message = "client_id must be a valid GUID string."
  }
}

variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
}

variable "enable_acr" {
  description = "Whether to create an Azure Container Registry (ACR) using the AVM module."
  type        = bool
  default     = false
}

variable "acr_name" {
  description = "ACR name (5-50 lowercase alphanumeric). Required when enable_acr=true."
  type        = string
  default     = ""

  validation {
    condition     = !var.enable_acr || can(regex("^[a-z0-9]{5,50}$", var.acr_name))
    error_message = "When enable_acr=true, acr_name must be 5-50 characters, lowercase alphanumeric only (a-z, 0-9)."
  }
}

variable "acr_sku" {
  description = <<-EOT
  ACR SKU (Basic, Standard, Premium).

  Pricing/feature guidance:
  - Basic: lowest cost, best for dev/test and light usage.
  - Standard: higher throughput/limits than Basic for many production workloads.
  - Premium: required for Private Link/private endpoints.

  Official pricing: https://azure.microsoft.com/en-us/pricing/details/container-registry/#pricing
  EOT
  type        = string
  default     = "Basic"
}

variable "acr_public_network_access_enabled" {
  description = <<-EOT
  Whether public access is permitted for the ACR.

  Note (BC Gov Azure Landing Zone): public ACR and Basic SKU are allowed.
  If you need private connectivity (Private Link/private endpoints), keep public access disabled and use Premium.
  EOT
  type        = bool
  default     = true
}

variable "acr_enable_private_endpoint" {
  description = "Whether to create a private endpoint (Private Link) for the ACR. Premium is required when enabled."
  type        = bool
  default     = false
}
variable "acr_admin_enabled" {
  description = "Whether the admin user is enabled for the ACR."
  type        = bool
  default     = false
}
variable "enable_app_service_frontend" {
  description = "Whether to enable the App Service frontend"
  type        = bool
  default     = true
  validation {
    # Valid when at least one ingress option is enabled.
    condition     = var.enable_frontdoor || var.enable_app_service_frontend
    error_message = "At least one of Frontdoor or App Service Frontend must be enabled."
  }
}
variable "enable_app_service_backend" {
  description = "Whether to enable the App Service backend (default backend hosting option)"
  type        = bool
  default     = true
  validation {
    # Valid when at least one backend hosting option is enabled.
    condition     = var.enable_container_apps || var.enable_app_service_backend
    error_message = "At least one of App Service Backend or Container Apps must be enabled."
  }
}
variable "frontend_image" {
  description = "The image for the Frontend container"
  type        = string
}

# Container Apps Configuration (optional, alongside App Service)
variable "enable_container_apps" {
  description = "Enable Azure Container Apps alongside App Service (optional for higher scaling needs)"
  type        = bool
  default     = false
}

variable "container_apps_cpu" {
  description = "CPU allocation for Container Apps (in cores)"
  type        = number
  default     = 0.25

  validation {
    condition     = var.container_apps_cpu > 0
    error_message = "container_apps_cpu must be greater than 0."
  }
}

variable "container_apps_memory" {
  description = "Memory allocation for Container Apps"
  type        = string
  default     = ".5Gi"

  validation {
    condition     = can(regex("^[0-9]+(\\.[0-9]+)?(Gi|Mi)$", var.container_apps_memory))
    error_message = "container_apps_memory must use Mi or Gi units, e.g. 512Mi or 0.5Gi."
  }
}

variable "container_apps_min_replicas" {
  description = "Minimum number of replicas for Container Apps"
  type        = number
  default     = 0
}

variable "container_apps_max_replicas" {
  description = "Maximum number of replicas for Container Apps"
  type        = number
  default     = 3

  validation {
    condition     = var.container_apps_max_replicas >= var.container_apps_min_replicas
    error_message = "container_apps_max_replicas must be greater than or equal to container_apps_min_replicas."
  }
}

variable "enable_frontdoor" {
  description = "Enable Azure Front Door (set false to expose App Service directly)"
  type        = bool
  default     = false
}

variable "frontdoor_sku_name" {
  description = "SKU name for the Front Door"
  type        = string
  default     = "Standard_AzureFrontDoor"

  validation {
    condition     = contains(["Standard_AzureFrontDoor", "Premium_AzureFrontDoor"], var.frontdoor_sku_name)
    error_message = "frontdoor_sku_name must be Standard_AzureFrontDoor or Premium_AzureFrontDoor."
  }
}

variable "rate_limit_duration_in_minutes" {
  description = "Duration in minutes for Front Door rate limiting"
  type        = number
  default     = 1

  validation {
    condition     = var.rate_limit_duration_in_minutes >= 1 && var.rate_limit_duration_in_minutes <= 60
    error_message = "rate_limit_duration_in_minutes must be between 1 and 60."
  }
}

variable "rate_limit_threshold" {
  description = "Request threshold for Front Door rate limiting (requests per duration)"
  type        = number
  default     = 60

  validation {
    condition     = var.rate_limit_threshold >= 1 && var.rate_limit_threshold <= 2147483647
    error_message = "rate_limit_threshold must be between 1 and 2147483647."
  }
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "Canada Central"
}

variable "log_analytics_retention_days" {
  description = "Number of days to retain data in Log Analytics Workspace"
  type        = number
  default     = 30

  validation {
    condition     = var.log_analytics_retention_days >= 30 && var.log_analytics_retention_days <= 730
    error_message = "log_analytics_retention_days must be between 30 and 730."
  }
}

variable "log_analytics_sku" {
  description = "SKU for Log Analytics Workspace"
  type        = string
  default     = "PerGB2018"
}

variable "fabric_sql_connection_string" {
  description = "Connection between datamart API and fabric"
  type        = string
  default     = ""
}

variable "user_assigned_managed_identity_id" {
  description = "Resource ID of an existing user-assigned managed identity to attach to the datamart API host. It must have access to the Fabric workspace. Leave empty to use only the system-assigned identity."
  type        = string
  default     = ""
}

variable "user_assigned_managed_identity_client_id" {
  description = "Client ID of the user-assigned managed identity. When set, Terraform appends User Id=<client id> to the Fabric connection string unless it already contains a User Id."
  type        = string
  default     = ""
}

variable "enable_application_alerts" {
  description = "Whether application alert resources should be created when alert recipients are configured."
  type        = bool
  default     = true
}

variable "application_alert_emails" {
  description = "Email recipients for backend application alerts. If empty, PostgreSQL alert recipients are reused when available."
  type        = list(string)
  default     = []
}

variable "application_runtime_issue_alert_threshold" {
  description = "Number of matching runtime failure log entries within the alert window required to trigger the backend runtime issue alert."
  type        = number
  default     = 2

  validation {
    condition     = var.application_runtime_issue_alert_threshold >= 1
    error_message = "application_runtime_issue_alert_threshold must be greater than or equal to 1."
  }
}

variable "application_database_issue_alert_threshold" {
  description = "Number of matching database connectivity failures within the alert window required to trigger the backend database alert."
  type        = number
  default     = 2

  validation {
    condition     = var.application_database_issue_alert_threshold >= 1
    error_message = "application_database_issue_alert_threshold must be greater than or equal to 1."
  }
}

variable "app_service_http_5xx_alert_threshold" {
  description = "Total backend App Service HTTP 5xx responses in five minutes required to trigger the platform error alert."
  type        = number
  default     = 5

  validation {
    condition     = var.app_service_http_5xx_alert_threshold >= 1
    error_message = "app_service_http_5xx_alert_threshold must be greater than or equal to 1."
  }
}

variable "backend_http_5xx_alert_threshold" {
  description = "Total backend HTTP 5xx responses in Container Apps request logs within five minutes required to trigger the backend HTTP 5xx log alert. The backend App Service remains covered by the native Http5xx metric alert."
  type        = number
  default     = 5

  validation {
    condition     = var.backend_http_5xx_alert_threshold >= 1
    error_message = "backend_http_5xx_alert_threshold must be greater than or equal to 1."
  }
}

variable "container_app_restart_alert_threshold" {
  description = "Total backend container restarts in fifteen minutes required to trigger the restart alert."
  type        = number
  default     = 3

  validation {
    condition     = var.container_app_restart_alert_threshold >= 1
    error_message = "container_app_restart_alert_threshold must be greater than or equal to 1."
  }
}

variable "repo_name" {
  description = "Name of the repository, used for resource naming"
  type        = string
  default     = "quickstart-azure-containers"
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "subscription_id" {
  description = "Azure subscription ID"
  type        = string
  sensitive   = true

  validation {
    condition     = can(regex("^[0-9a-fA-F-]{36}$", var.subscription_id))
    error_message = "subscription_id must be a valid GUID string."
  }
}

variable "tenant_id" {
  description = "Azure tenant ID"
  type        = string
  sensitive   = true

  validation {
    condition     = can(regex("^[0-9a-fA-F-]{36}$", var.tenant_id))
    error_message = "tenant_id must be a valid GUID string."
  }
}

variable "use_oidc" {
  description = "Use OIDC for authentication"
  type        = bool
  default     = true
}

variable "vnet_address_space" {
  type        = string
  description = "Address space for the virtual network, it is created by platform team"
}

variable "vnet_name" {
  description = "Name of the existing virtual network"
  type        = string
}

variable "vnet_resource_group_name" {
  description = "Resource group name where the virtual network exists"
  type        = string
}

# -------------
# API Management Variables
# -------------

variable "enable_apim" {
  description = "Whether to enable API Management service"
  type        = bool
  default     = false
}

variable "vivid_cidr" {
  description = "Vivid CIDR block, used to limit access to DEV environment"
  type        = string
  default     = ""
}

variable "apim_publisher_name" {
  description = "The name of the publisher/company for APIM"
  type        = string
  default     = "BC Government"
}

variable "apim_publisher_email" {
  description = "The email address of the publisher/company for APIM"
  type        = string
  default     = "no-reply@gov.bc.ca"
}

variable "apim_sku_name" {
  description = "The SKU of the API Management service"
  type        = string
  default     = "StandardV2_1" # this one or "PremiumV2" works in landing zone. `_1 ` is the capacity.
}


variable "apim_enable_diagnostic_settings" {
  description = "Whether to enable diagnostic settings for the API Management service"
  type        = bool
  default     = true
}

variable "apim_enable_application_insights_logger" {
  description = "Whether to enable Application Insights logger for the API Management service"
  type        = bool
  default     = true
}


variable "prevent_rg_deletion_if_contains_resources" {
  description = "AzureRM provider feature flag: refuse to delete a resource group if Azure reports it still contains resources. Set false to allow RG deletion even when Azure-managed/auto-created resources remain (e.g., App Insights Smart Detector rules)."
  type        = bool
  default     = true
}
