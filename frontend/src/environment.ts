import { Environment } from "./main";

export type { Environment } from "./main";

export const environment: Environment = {
    REST_BASE_URL: 'api',
    GRAPHQL_BASE_URL: 'graphql',
    DOWNLOAD_BASE_URL: 'data-export',
    MAX_DOWNLOAD_ROW_COUNT: 10000,
}
