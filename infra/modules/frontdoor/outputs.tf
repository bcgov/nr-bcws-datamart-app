output "firewall_policy_id" {
  description = "The ID of the Front Door firewall policy."
  value       = azurerm_cdn_frontdoor_firewall_policy.unified_firewall_policy.id

}

output "frontdoor_id" {
  description = "The name of the Front Door endpoint."
  value       = azurerm_cdn_frontdoor_profile.unified_frontdoor.id
}

output "frontdoor_resource_guid" {
  description = "The resource GUID of the Front Door profile."
  value       = azurerm_cdn_frontdoor_profile.unified_frontdoor.resource_guid
}

output "endpoint_id" {
  description = "ID for frontdoor endpoint"
  value =  azurerm_cdn_frontdoor_endpoint.unified_fd_endpoint.id
}

output "endpoint_hostname" {
  description = "ID for frontdoor endpoint"
  value =  azurerm_cdn_frontdoor_endpoint.unified_fd_endpoint.host_name
}
