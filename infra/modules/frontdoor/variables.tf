variable "app_name" {
  description = "Name of the application"
  type        = string
  nullable    = false
}

variable "app_env" {
  description = "Name of environment"
  type = string
  nullable = false
}

variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  nullable    = false
}

variable "frontdoor_sku_name" {
  description = "The SKU name for the Front Door."
  type        = string
  nullable    = false
}

variable "rate_limit_duration_in_minutes" {
  description = "Duration in minutes for rate limiting."
  type        = number
  nullable    = false
}

variable "resource_group_name" {
  description = "The name of the resource group to create."
  type        = string
  nullable    = false
}

variable "log_analytics_workspace_id" {
  description = "Resource ID of the Log Analytics workspace to send Front Door diagnostic logs to."
  type        = string
  nullable    = false
}

#Rate Limits

variable "frontend_rate_limit_threshold" {
  description = "Max requests to frontend from any given IP in one minute"
  type = number
  default = 300
}

variable "api_http_rate_limit_threshold" {
  description = "Max http requests to API from any given IP in one minute"
  type = number
  default = 300
}
variable "api_mcp_rate_limit_threshold" {
  description = "Max mcp requests to API from any given IP in one minute"
  type = number
  default = 120
}
variable "api_graphql_rate_limit_threshold" {
  description = "Max graphql requests to API from any given IP in one minute"
  type = number
  default = 300
}

variable "download_api_rate_limit_threshold" {
  description = "Max graphql requests to download api from any given IP in one minute"
  type = number
  default = 30
}