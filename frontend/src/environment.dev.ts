import { Environment } from "./main";

export type { Environment } from "./main";

export const environment: Environment = {
    REST_BASE_URL: 'https://nr-bcws-datamart-app-int-api.azurewebsites.net/api',
    GRAPHQL_BASE_URL: 'https://nr-bcws-datamart-app-int-api.azurewebsites.net/graphql',
    DOWNLOAD_BASE_URL: 'https://nr-bcws-datamart-app-int-download-api.azurewebsites.net/api/downloads',
}