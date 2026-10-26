# Datamart API: Data API builder (DAB)

This API lives in `backend/datamart-api`. Each API of the backend has its own folder under `backend/`. It is a [Data API builder](https://learn.microsoft.com/azure/data-api-builder/) service that exposes views of a Microsoft Fabric SQL analytics endpoint as REST, GraphQL and MCP endpoints. It contains no application code. The behavior is defined by [`dab-config.json`](dab-config.json) and the same container image runs locally and in Azure.

| File | Purpose |
| --- | --- |
| `dab-config.json` | Entities, endpoints and permissions. Reads its settings from environment variables. |
| `Dockerfile` | Builds the image: the official DAB image plus `dab-config.json`. |
| `.env.example` | Template for the local `.env` file (git-ignored). |

## Configuration

| Environment variable | Required | Description |
| --- | --- | --- |
| `FABRIC_SQL_CONNECTION_STRING` | Yes | Connection string of the Fabric SQL analytics endpoint. |
| `DAB_RUNTIME_MODE` | Yes for the DAB CLI, defaults to `production` in the image | `development` or `production`. |
| `DAB_CORS_ORIGIN` | Yes for the DAB CLI, defaults to `*` in the image | Browser origin allowed to call the API. |

The `Authentication` keyword in the connection string decides how DAB signs in to Fabric:

```text
# Docker with an Entra ID user name and password (your IDIR email and password)
Server=<name>.datawarehouse.fabric.microsoft.com;Database=<warehouse>;Authentication=Active Directory Password;User Id=<IDIR email>;Password=<IDIR password>;Encrypt=True;TrustServerCertificate=False;Command Timeout=240;

# Service principal (Docker, or anywhere without a signed-in user)
Server=<name>.datawarehouse.fabric.microsoft.com;Database=<warehouse>;Authentication=Active Directory Service Principal;User ID=<client-id>;Password=<client-secret>;Encrypt=True

# Managed identity (Azure only)
Server=<name>.datawarehouse.fabric.microsoft.com;Database=<warehouse>;Authentication=Active Directory Managed Identity;Encrypt=True

# Local DAB CLI: your own sign-in, for example az login or a browser prompt
Server=<name>.datawarehouse.fabric.microsoft.com;Database=<warehouse>;Authentication=Active Directory Interactive;Encrypt=True
```

Whichever identity you use must have access to the Fabric workspace (Viewer or higher). Service principals also require the Fabric tenant setting "Service principals can use Fabric APIs".

`Active Directory Password` works only for accounts that are not required to use multi-factor authentication. If the sign-in fails with an MFA error, use a service principal instead. Keep your IDIR password out of shared files and shell history, and use the value only in the git-ignored `backend/datamart-api/.env`.

## Endpoints

| Endpoint | Path |
| --- | --- |
| Health (no database query) | `/` |
| REST | `/api/<entity>`, for example `/api/weather_stations?$first=10` |
| GraphQL | `/graphql` |
| MCP | `/mcp` |

The frontend proxies `/api` to this service (see [`frontend/Caddyfile`](../../frontend/Caddyfile)), which is why the REST path is `/api`.

## Run locally

### Option 1: Docker

Run all commands from the `backend/datamart-api` folder.

1. Go to the `backend/datamart-api` folder:

```bash
cd backend/datamart-api
```

2. Create your `.env` file from the template:

```bash
cp .env.example .env
```

3. Edit `.env` and set `FABRIC_SQL_CONNECTION_STRING` (IDIR user and password, or service principal format). Do not wrap values in quotes, because Docker keeps the quotes as part of the value.

4. Build the image, then remove the previous build:

```bash
docker build -t datamart-dab .
```

```bash
docker image prune -f --filter "label=app=datamart-dab"
```

Each build with a changed `dab-config.json` creates a new image and leaves the previous one untagged (`<none>` in Docker Desktop). The second command removes those leftovers. It affects only images of this project, and it skips an image that a running container uses. Images built before the `LABEL` was added to the `Dockerfile` do not carry the label, so remove those once with `docker image prune -f`, which removes every untagged image on your machine.

5. Run the container:

```bash
docker run --rm -p 5000:5000 --env-file .env datamart-dab
```

6. Open <http://localhost:5000/api/weather_stations?$first=2>.

Press Ctrl+C to stop the container.

You can also run it through the root `docker-compose.yml`. Run this command from the repository root. Compose reads `FABRIC_SQL_CONNECTION_STRING` from your shell or a root `.env` file, not from `backend/datamart-api/.env`, and publishes DAB on port 3001:

```bash
docker compose up --build backend
```

### Option 2: DAB CLI

Install the [.NET 8 SDK](https://dotnet.microsoft.com/download), then:

```bash
dotnet tool install --global Microsoft.DataApiBuilder --version 2.0.12
cd backend/datamart-api
cp .env.example .env   # then set FABRIC_SQL_CONNECTION_STRING in .env
dab start
```

DAB loads `backend/datamart-api/.env` automatically. With the CLI, the `Active Directory Interactive` connection string is the simplest option.

## Deploy to Azure

Terraform in `infra/` deploys this image. CI builds it from this folder (`.github/workflows/.builds.yml`, with `build_context` set to `backend/datamart-api`) and publishes `ghcr.io/<owner>/<repo>/backend:<tag>`, and Terraform passes that image to the backend host (Container Apps or App Service).

1. Create the GitHub environment secret `FABRIC_SQL_CONNECTION_STRING` for each environment. The deployer workflow passes it to Terraform as `TF_VAR_fabric_sql_connection_string`, and Terraform stores it as a Container Apps secret (or App Service app setting).
2. For the managed identity style, deploy first, then add the identity to the Fabric workspace. Read its object ID from the Terraform output `backend_managed_identity_principal_id` (Container Apps). In Fabric, open the workspace, choose Manage access, and add the identity as Viewer. Look up the identity by the name of the container app.
3. For local Terraform runs, set `TF_VAR_fabric_sql_connection_string` together with the other `TF_VAR_*` values described in `GHA.md`.

The Container Apps host sets `DAB_CORS_ORIGIN` to the frontend URL and runs DAB in production mode. Probes call `/`, which DAB answers without querying Fabric.
