output "storage_account_name" {
  value = azurerm_storage_account.app.name
}

output "storage_account_id" {
  value = azurerm_storage_account.app.id
}

output "download_queue_name" {
  value = azurerm_storage_queue.download_jobs.name
}

output "resource_group_name" {
  value = azurerm_resource_group.storage.name
}

output "download_queue_identity_id" {
  value = azurerm_user_assigned_identity.download_queue.id
}

output "download_queue_identity_client_id" {
  value = azurerm_user_assigned_identity.download_queue.client_id
}