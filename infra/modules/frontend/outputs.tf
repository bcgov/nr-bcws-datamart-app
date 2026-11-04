output "frontend_app_service_url" {
  description = "The URL of the frontend App Service)"
  value       = "https://${module.frontend_site.resource_uri}"
}

output "possible_outbound_ip_addresses" {
  description = "Possible outbound IP addresses for the frontend application."
  value       = data.azurerm_linux_web_app.frontend_lookup.possible_outbound_ip_addresses
}
