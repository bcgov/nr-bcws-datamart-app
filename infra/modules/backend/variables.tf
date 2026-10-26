variable "api_image" {
  description = "The Docker image for the backend API, including an explicit tag."
  type        = string
  nullable    = false

  validation {
    condition     = can(regex(":[^:/]+$", var.api_image))
    error_message = "api_image must include an explicit tag, e.g. 'ghcr.io/org/repo:tag'."
  }
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


variable "frontend_frontdoor_resource_guid" {
  description = "The resource GUID for the Front Door service associated with the frontend App Service."
  type        = string
  nullable    = true
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

variable "fabric_sql_connection_string"  {
  description = "Connection between datamart API and fabric"
  type = string
  default = ""
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
  type = string
  default = ""
}

