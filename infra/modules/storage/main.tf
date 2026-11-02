resource "azurerm_resource_group" "storage" {
  name     = "${var.app_name}-storage"
  location = var.location

  tags = var.common_tags
}

resource "azurerm_storage_account" "app" {
  name                     = substr(lower(replace("${var.app_name}st", "-", "")), 0, 24)

  resource_group_name      = azurerm_resource_group.storage.name
  location                 = azurerm_resource_group.storage.location

  account_tier             = "Standard"
  account_replication_type = "LRS"

  min_tls_version          = "TLS1_2"

  tags = var.common_tags
}

resource "azurerm_storage_queue" "download_jobs" {
  name               = "download-jobs-${var.app_env}"
  storage_account_id = azurerm_storage_account.app.id
}

resource "azurerm_user_assigned_identity" "download_queue" {
  name                = "${var.app_name}-download-queue-mi"
  resource_group_name = azurerm_resource_group.storage.name
  location            = azurerm_resource_group.storage.location

  tags = var.common_tags
}

resource "azurerm_role_assignment" "download_queue_access" {
  scope                = azurerm_storage_account.app.id
  role_definition_name = "Storage Queue Data Contributor"
  principal_id         = azurerm_user_assigned_identity.download_queue.principal_id
}