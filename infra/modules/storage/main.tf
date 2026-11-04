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

  allow_nested_items_to_be_public = true

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

resource "azurerm_user_assigned_identity" "download_blob" {
  name                = "${var.app_name}-download-blob-mi"
  resource_group_name = azurerm_resource_group.storage.name
  location            = azurerm_resource_group.storage.location

  tags = var.common_tags
}

resource "azurerm_role_assignment" "download_blob_access" {
  scope                = azurerm_storage_account.app.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_user_assigned_identity.download_blob.principal_id
}


resource "azurerm_storage_container" "datamart_packages" {
  name                  = "datamart-packages"
  storage_account_id    = azurerm_storage_account.app.id
  container_access_type = "blob"
}

resource "azurerm_storage_management_policy" "datamart_packages" {
  storage_account_id = azurerm_storage_account.app.id

  rule {
    name    =  "datamart-package-retention"
    enabled = true

    filters {
      blob_types   = ["blockBlob"]
      prefix_match = ["datamart-packages/"]
    }

    actions {
      base_blob {
        delete_after_days_since_creation_greater_than = 7
      }
    }
  }
}
