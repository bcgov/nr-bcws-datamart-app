import { Environment } from "./main";

export type { Environment } from "./main";

const HOST = 'wildfiredatamart-int.nrs.gov.bc.ca'

export const environment: Environment = {
    REST_BASE_URL: `https://${ HOST }/api`,
    GRAPHQL_BASE_URL: `https://${ HOST }/graphql`,
    DOWNLOAD_BASE_URL: `https://https://wildfiredatamart-int.nrs.gov.bc.ca/data-export`,
    MAX_DOWNLOAD_ROW_COUNT: 10000,
}
