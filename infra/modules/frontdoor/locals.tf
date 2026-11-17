locals {
  waf_endpoints = {
    api = {
      path = "/api", exclude = null
      methods = ["GET", "POST"]
      method_priority = 110, rate_priority = 200, rate_limit = var.api_http_rate_limit_threshold
    }
    download = {
      path = "/data-export", exclude = null
      methods = ["GET"]
      method_priority = 100, rate_priority = 210, rate_limit = var.download_api_rate_limit_threshold
    }
    graphql = {
      path = "/graphql", exclude = null
      methods = ["POST"]
      method_priority = 120, rate_priority = 220, rate_limit = var.api_graphql_rate_limit_threshold
    }
    mcp = {
      path = "/mcp", exclude = null
      methods = ["GET"]
      method_priority = 130, rate_priority = 230, rate_limit = var.api_mcp_rate_limit_threshold
    }
    frontend = {
      path = "/", exclude = null
      methods = ["GET", "POST"]
      method_priority = 200, rate_priority = 300, rate_limit = var.frontend_rate_limit_threshold
    }
  }
}