locals {
  frontend_ip_restrictions = var.enable_frontdoor ? [
    {
      action                    = "Allow"
      name                      = "Allow traffic from Front Door"
      priority                  = 100
      service_tag               = "AzureFrontDoor.Backend"
      ip_address                = null
      virtual_network_subnet_id = null
      headers = {
        x_azure_fdid      = [var.frontend_frontdoor_resource_guid]
        x_fd_health_probe = []
        x_forwarded_for   = []
        x_forwarded_host  = []
      }
    }
    ] : [
    {
      action                    = "Allow"
      name                      = "AllowVivid"
      priority                  = 200
      ip_address                = var.vivid_cidr
      service_tag               = null
      virtual_network_subnet_id = null
      headers                   = null
    }
  ]
}
