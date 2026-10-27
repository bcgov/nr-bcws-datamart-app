# Data API builder (DAB) service that exposes Microsoft Fabric data as REST, GraphQL and MCP endpoints.
#
# The image is configured entirely through environment variables, so the same image runs locally
# and in Azure:
#   FABRIC_SQL_CONNECTION_STRING  Required. Connection string of the first Fabric SQL analytics endpoint.
#   FABRIC_SQL_CONNECTION_STRING_2 Required. Connection string of the second Fabric SQL analytics endpoint.
#   DAB_RUNTIME_MODE              Optional. "production" (default) or "development".
#   DAB_CORS_ORIGIN               Optional. Browser origin allowed to call the API. Defaults to "*".
#
# Pin DAB_VERSION to a tag listed at https://mcr.microsoft.com/v2/azure-databases/data-api-builder/tags/list
ARG DAB_VERSION=2.0.12
FROM mcr.microsoft.com/azure-databases/data-api-builder:${DAB_VERSION}

# Lets developers remove old local builds of this image without touching other images.
LABEL app="datamart-dab"

# dab-config.json lists the additional data source files in data-source-files.
COPY dab-config.json dab-config.db1.json dab-config.db2.json /App/

# "production" hides development-only features. Override with -e DAB_RUNTIME_MODE=development locally.
ENV DAB_RUNTIME_MODE=production

# The API serves public, read-only data. Terraform narrows this to the frontend URL in Azure.
ENV DAB_CORS_ORIGIN=*

# DAB listens on port 5000 by default.
EXPOSE 5000
