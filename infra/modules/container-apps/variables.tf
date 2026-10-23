# Container Apps Module Variables - Backend Only (Data API builder)

variable "app_env" {
  description = "Application environment (dev, test, prod)"
  type        = string
  nullable    = false
}

variable "app_name" {
  description = "Name of the application"
  type        = string
  nullable    = false
}

variable "app_service_frontend_url" {
  description = "URL of the App Service frontend. Used as the CORS origin of the API. Empty allows any origin."
  type        = string
  nullable    = false
}

variable "backend_image" {
  description = "Container image for the backend API (the Data API builder image built from backend/)"
  type        = string
  nullable    = false
}

variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  nullable    = false
}

variable "container_apps_subnet_id" {
  description = "Subnet ID for Container Apps Environment"
  type        = string
  nullable    = false
}

variable "container_cpu" {
  description = "CPU allocation for backend container app (in cores)"
  type        = number
  default     = 0.25
  nullable    = false
}

variable "container_memory" {
  description = "Memory allocation for backend container app"
  type        = string
  default     = "0.5Gi"
  nullable    = false
}

variable "dab_port" {
  description = "Port that Data API builder listens on inside the container."
  type        = number
  default     = 5000
  nullable    = false
}

variable "dab_runtime_mode" {
  description = "Data API builder host mode (production or development)."
  type        = string
  default     = "production"
  nullable    = false

  validation {
    condition     = contains(["production", "development"], var.dab_runtime_mode)
    error_message = "dab_runtime_mode must be production or development."
  }
}

variable "enable_system_assigned_identity" {
  description = "Enable system assigned managed identity"
  type        = bool
  default     = true
  nullable    = false
}

variable "fabric_sql_connection_string" {
  description = "Connection string of the Microsoft Fabric SQL analytics endpoint that Data API builder reads from."
  type        = string
  sensitive   = true
  nullable    = false
}

variable "location" {
  description = "Azure region where resources will be deployed"
  type        = string
  nullable    = false
}

variable "log_analytics_workspace_id" {
  description = "Log Analytics Workspace ID for Container Apps Environment"
  type        = string
  nullable    = false
}

variable "max_replicas" {
  description = "Maximum number of replicas for backend"
  type        = number
  default     = 10 # Higher max for Consumption workload
  nullable    = false
}

variable "min_replicas" {
  description = "Minimum number of replicas for backend"
  type        = number
  default     = 0 # Allow scale to zero for Consumption workload
  nullable    = false
}

variable "private_endpoint_subnet_id" {
  description = "Subnet ID for the private endpoint"
  type        = string
  nullable    = false
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  nullable    = false
}
variable "log_analytics_workspace_customer_id" {
  description = "Log Analytics Workspace customer ID (GUID) for Container Apps Environment logs"
  type        = string
  nullable    = false
}

variable "log_analytics_workspace_key" {
  description = "Log Analytics Workspace primary shared key for Container Apps Environment logs"
  type        = string
  sensitive   = true
  nullable    = false
}
