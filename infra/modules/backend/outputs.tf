output "backend_url" {
  description = "The URL of the backend App Service"
  value       = module.backend_site.resource_uri
}

output "backend_app_service_name" {
  description = "The name of the backend App Service"
  value       = module.backend_site.name
}

output "backend_app_service_id" {
  description = "The resource ID of the backend App Service"
  value       = module.backend_site.resource_id
}

output "download_api_url" {
  description = "The URL of the Download API App Service"
  value       = module.download_api_site.resource_uri
}

output "download_api_app_service_name" {
  description = "The name of the Download API App Service"
  value       = module.download_api_site.name
}

output "download_api_app_service_id" {
  description = "The resource ID of the Download API App Service"
  value       = module.download_api_site.resource_id
}