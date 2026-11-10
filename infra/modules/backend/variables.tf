variable "datamart_api_image" {
  description = "The Docker image for the Datamart API, including an explicit tag."
  type        = string
  nullable    = false

  validation {
    condition     = can(regex(":[^:/]+$", var.datamart_api_image))
    error_message = "datamart_api_image must include an explicit tag, e.g. 'ghcr.io/org/repo:tag'."
  }
}

variable "download_api_image" {
  description = "The Docker image for the Download API, including an explicit tag."
  type        = string
  nullable    = false

  validation {
    condition     = can(regex(":[^:/]+$", var.download_api_image))
    error_message = "download_api_image must include an explicit tag."
  }
}

variable "download_sync_threshold" {
  description = "Maximum synchronous export row count."
  type        = number
  default     = 10000
}

variable "download_page_size" {
  description = "Page size that download api uses to request from datamart API."
  type        = number
  default     = 1000
}

variable "download_scheduler_enabled" {
  type = bool
}

variable "download_scheduler_cron" {
  type = string
}

variable "download_queue_visibility_timeout_seconds" {
  type = number
}

variable "download_queue_retry_count" {
  type = number
}

variable "download_queue_retry_backoff_minutes" {
  type = number
}

variable "download_blob_container_name" {
  type = string
}


variable "bc_notify_api_key" {
  description = "BC Notify API key passed to the Download API as the BC_NOTIFY_API_KEY app setting."
  type        = string
  default     = ""
}

variable "bc_notify_email_endpoint" {
  description = "BC Notify email endpoint URL."
  type        = string
  default     = "https://notify.digital.gov.bc.ca/api/v1/notifysimple/email"
}

variable "bc_notify_admin_email" {
  description = "Admin email address for datamart download failures."
  type        = string
  default     = "wfwx_team@vividsolutions.microsoftonline.com"
}

variable "bc_notify_download_success_template_id" {
  description = "Template ID to be provided to BC notify for use in selecting which success email wording to send."
  type        = string
  default     = ""
}


variable "bc_notify_download_failure_template_id" {
  description = "Template ID to be provided to BC notify for use in selecting which failure email wording to send."
  type        = string
  default     = ""
}



variable "datamart_timeout_seconds" {
  description = "Timeout in seconds for calls to Datamart API."
  type        = number
  default     = 30
}

variable "app_env" {
  description = "The deployment environment (e.g., dev, test, prod)."
  type        = string
  nullable    = false
}

variable "app_name" {
  description = "The base name of the application. Used for naming Azure resources."
  type        = string
  nullable    = false
}

variable "app_service_sku_name_backend" {
  description = "The SKU name for the backend App Service plan."
  type        = string
  nullable    = false
}

variable "app_service_plan_worker_count" {
  description = <<-EOT
  App Service Plan worker count (instance count).

  Why this exists:
  - The AVM App Service Plan (serverfarm) module can default to multiple workers.
  - For Basic tiers (e.g., B1), requesting multiple workers can trigger Azure capacity/conflict errors (e.g., 409) depending on region/quota/availability.

  Recommended default:
  - Keep this at 1 for Basic SKUs unless you explicitly need more instances.

  References:
  - AVM serverfarm module: https://registry.terraform.io/modules/Azure/avm-res-web-serverfarm/azurerm/1.0.0
  - AzureRM Service Plan worker_count: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/service_plan#worker_count
  EOT
  type        = number
  default     = 1

  validation {
    condition     = var.app_service_plan_worker_count >= 1
    error_message = "app_service_plan_worker_count must be >= 1."
  }
}

variable "app_service_subnet_id" {
  description = "The subnet ID for the App Service."
  type        = string
  nullable    = false
}

variable "appinsights_connection_string" {
  description = "The Application Insights connection string for monitoring."
  type        = string
  sensitive   = true
  nullable    = false
}

variable "appinsights_instrumentation_key" {
  description = "The Application Insights instrumentation key."
  type        = string
  sensitive   = true
  nullable    = false
}

variable "enable_backend_autoscale" {
  description = "Whether autoscaling is enabled for the backend App Service plan."
  type        = bool
  default     = true
}

variable "backend_subnet_id" {
  description = "The subnet ID for the backend App Service."
  type        = string
  nullable    = false
}

variable "common_tags" {
  description = "A map of tags to apply to resources."
  type        = map(string)
  default     = {}
}

variable "container_registry_url" {
  description = "The URL of the container registry to pull images from."
  type        = string
  nullable    = false
  default     = "https://ghcr.io"
}

variable "backend_frontdoor_id" {
  description = "The ID of the Front Door profile for the frontend."
  type        = string
  nullable    = true
}

variable "backend_frontdoor_resource_guid" {
  description = "The resource GUID for the Front Door service associated with the backend App Service."
  type        = string
  nullable    = true
}

variable "frontdoor_endpoint_id" {
  description = "ID for frontdoor endpoint"
  type = string
  nullable = true
}

variable "frontend_possible_outbound_ip_addresses" {
  description = "Possible outbound IP addresses for the frontend App Service."
  type        = string
  nullable    = false
}

variable "enable_frontdoor" {
  description = "Whether Front Door is enabled. Controls backend IP restrictions for Front Door headers."
  type        = bool
  nullable    = false
}

variable "location" {
  description = "The Azure region where resources will be created."
  type        = string
  nullable    = false
}

variable "log_analytics_workspace_id" {
  description = "The resource ID of the Log Analytics workspace for diagnostics."
  type        = string
  nullable    = false
}

variable "repo_name" {
  description = "The repository name, used for resource naming."
  type        = string
  nullable    = false
}

variable "resource_group_name" {
  description = "The name of the resource group in which to create resources."
  type        = string
  nullable    = false
}

variable "resource_group_id" {
  description = "The resource ID of the resource group in which to create resources (required by avm-res-web-site's parent_id argument)."
  type        = string
  nullable    = false
}

variable "enable_telemetry" {
  description = "Whether AVM modules should send telemetry."
  type        = bool
  default     = false
}

variable "fabric_sql_connection_string" {
  description = "Connection between datamart API and fabric"
  type        = string
  default     = ""
}

variable "fabric_sql_connection_string_2" {
  description = "Connection between datamart API and the second Fabric database"
  type        = string
  default     = ""
}

variable "user_assigned_identity_id" {
  description = "Resource ID of a user-assigned managed identity to attach to the App Service. Empty means none."
  type        = string
  default     = ""
}

variable "dab_runtime_mode" {
  description = "Data API builder runtime mode (production or development). Substituted into dab-config.json through DAB_RUNTIME_MODE."
  type        = string
  default     = "production"

  validation {
    condition     = contains(["production", "development"], var.dab_runtime_mode)
    error_message = "dab_runtime_mode must be production or development."
  }
}

variable "vivid_cidr" {
  description = "Vivid CIDR block, used to restrict access to DEV"
  type        = string
  default     = ""
}

variable "storage_account_name" {
  type = string
}

variable "download_queue_name" {
  type = string
}

variable "download_queue_identity_id" {
  type = string
}

variable "download_queue_identity_client_id" {
  type = string
}

variable "download_blob_identity_id" {
  type = string
}

variable "download_blob_identity_client_id" {
  type = string
}