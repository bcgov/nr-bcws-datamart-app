import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { StationFilters } from '../models/station-filters';

const WEATHER_STATIONS_API = 'https://container-app-api-yujhzooydm766.bluewater-fbba4d31.canadacentral.azurecontainerapps.io/api/weather_stations';

export type WeatherStation = {
    WEATHER_STATION_GUID: string              // "03C0B7CE66EF41BFB0DBDE3A70AB68D0",
    STATION_ACRONYM: string                   // null,
    STATION_NAME: string                      // "Utopia",
    STATION_STATUS_CODE: string               // "ACTIVE",
    STATION_STATUS_DESC: string               // "Active",
    STATION_CODE: number                      // 1817,
    SITE_TYPE_CODE: string                    // null,
    SITE_TYPE_DESC: string                    // null,
    INFLUENCING_ASPECT_CODE: string           // null,
    INFLUENCING_ASPECT_DESC: string           // null,
    WEATHER_STATION_OWNER_GUID: string        // null,
    OWNER_NAME: string                        // null,
    OWNER_DISPLAY_NAME: string                // null,
    OWNER_COMMENT: string                     // null,
    DATA_LOGGER_TYPE_CODE: string             // "NONE",
    DATA_LOGGER_TYPE_DESC: string             // "None",
    WEATHER_ZONE: string                      // null,
    WEATHER_ZONE_DESC: string                 // null,
    DANGER_REGION: string                     // null,
    STATION_COMMENT: string                   // null,
    CRD_STATION_NAME: string                  // null,
    FIRE_CENTRE_ORG_UNIT_IDENT: string        // null,
    ZONE_ORG_UNIT_IDENTIFIER: string          // null,
    DATA_SOURCE: string                       // null,
    INSTALLATION_TIMESTAMP_MSEC: number       // 1790210557223,
    DECOMMISSION_TIMESTAMP_MSEC: string       // null,
    PST_DECOMM_TIMESTAMP: string              // "null",
    HOURLY_IND: string                        // "N",
    OVER_WINTER_PRECIP_ADJ_IND: string        // "N",
    LATITUDE: number                          // 45.555,
    LONGITUDE: number                         // -144.99,
    WKT_GEOM: string                          // "POINT (-144.99 45.555)",
    ELEVATION_M: number                       // 100,
    INFLUENCING_SLOPE: string                 // null,
    WINDSPEED_ADJUSTMENT_HEIGHT: string       // null,
    WINDSPEED_ADJUSTMENT_ROUGHNESS: string    // null,
    LAST_PROCESSED_SOURCE_TIME: string        // null,
    LAST_UPDATED_TIMESTAMP_MSEC: string       // 1790210860551
}

@Injectable({
  providedIn: 'root',
})
export class StationDataService {
//   private readonly stationsSubject = new BehaviorSubject<any[]>([]);

//   readonly stations$ = this.stationsSubject.asObservable();
  
    private _stationsPromise?: Promise<WeatherStation[]>

    getStations(): Promise<WeatherStation[]> {
        console.log('getStations')
        if ( this._stationsPromise ) return this._stationsPromise

        let fetchPage: ( url: string, accum: WeatherStation[], m: number ) => Promise<WeatherStation[]> = ( url, accum, maxPages ) => { 
            if ( maxPages == 0 ) return Promise.resolve( accum )

            return this.fetchWithRetry( url, 'getStations' ) 
                .then( res => res.json() )
                .then( payload => {
                    if ( payload.nextLink )
                        return fetchPage( payload.nextLink, accum.concat( payload.value ), maxPages - 1 )
                    
                    return accum.concat( payload.value )
                } )
        }

        this._stationsPromise = fetchPage( WEATHER_STATIONS_API, [], 2 )        

        return this._stationsPromise
    }

    fetchWithRetry( url: string, description: string, retries = 3, delay = 1000 ): Promise<Response> {
            // console.log(url)
        return fetch( url )
            .then( res => {
                console.log(res)
                if ( !res.ok ) {
                    throw Error( res.statusText )
                }

                return res
            } )
            .catch( err => {
                if ( retries > 0 ) {
                    console.warn( `${ description } failed: ${ err }, retrying` )

                    return new Promise( res => { setTimeout( res, delay ) } )
                        .then( () => {
                            return this.fetchWithRetry( url, description, retries - 1 )
                        } )
                }
                else {
                    console.error( `${ description } failed: ${ err }` )

                    throw Error( `${ description } failed` )
                }
            } )
    }

//   private loaded = false;
//   private loading = false;

//   constructor(private readonly ngZone: NgZone) {}

//   async loadStations(): Promise<void> {
//     if (this.loaded || this.loading) return;

//     this.loading = true;

//     try {
//       const response = await this.fetchWithRetry(WEATHER_STATIONS_API);
//       const data = await response.json();

//       const uniqueStations = [
//         ...new Map(
//           data.value.map((station: any) => [
//             station.WEATHER_STATION_GUID,
//             station,
//           ]),
//         ).values(),
//       ];

//       this.ngZone.run(() => {
//         this.stationsSubject.next(uniqueStations);
//         this.loaded = true;
//       });
//     } finally {
//       this.loading = false;
//     }
//   }

//   async loadStationsByIds( stationGuids: string[] ): Promise<any[]> {
//     if (stationGuids.length === 0) return [];

//     const filter = stationGuids
//       .map((id) => `WEATHER_STATION_GUID eq '${id}'`)
//       .join(' or ');

//     const response = await this.fetchWithRetry(
//       `${WEATHER_STATIONS_API}?$filter=${encodeURIComponent(filter)}`,
//     );

//     const data = await response.json();

//     return [
//       ...new Map(
//         data.value.map((station: any) => [
//           station.WEATHER_STATION_GUID,
//           station,
//         ]),
//       ).values(),
//     ];
//   }

//   async loadStationsFiltered(filters: StationFilters): Promise<void> {

//     const predicates: string[] = [];

//     if (filters.elevationMin !== null) predicates.push(`ELEVATION_M ge ${filters.elevationMin}`);

//     if (filters.elevationMax !== null) predicates.push(`ELEVATION_M le ${filters.elevationMax}`);

//     if (filters.latitudeMin !== null) predicates.push(`LATITUDE ge ${filters.latitudeMin}`);

//     if (filters.latitudeMax !== null) predicates.push(`LATITUDE le ${filters.latitudeMax}`);

//     if (filters.longitudeMin !== null) predicates.push(`LONGITUDE ge ${filters.longitudeMin}`);

//     if (filters.longitudeMax !== null) predicates.push(`LONGITUDE le ${filters.longitudeMax}`);

//     if (filters.stationStatus) predicates.push(`STATION_STATUS_DESC eq '${filters.stationStatus}'`);

//     const url = predicates.length
//       ? `${WEATHER_STATIONS_API}?$filter=${encodeURIComponent(predicates.join(' and '))}`
//       : WEATHER_STATIONS_API;

//     const response = await this.fetchWithRetry(url);
//     const data = await response.json();

//     const uniqueStations = [
//       ...new Map(
//         data.value.map((station: any) => [
//           station.WEATHER_STATION_GUID,
//           station,
//         ]),
//       ).values(),
//     ];

//     const filteredStations =
//       filters.searchText?.trim()
//         ? uniqueStations.filter(
//             (station: any) =>
//               station.STATION_NAME?.toLowerCase().includes(
//                 filters.searchText!.trim().toLowerCase(),
//               ),
//           )
//         : uniqueStations;

//     this.ngZone.run(() => this.stationsSubject.next(filteredStations));
//   }

//   async clearFilters(): Promise<void> {
//     this.loaded = false;
//     await this.loadStations();
//   }

// //   private async fetchWithRetry( url: string, maxAttempts = 3, ): Promise<Response> {
// //     let lastError: unknown;

// //     for (let attempt = 1; attempt <= maxAttempts; attempt++) {
// //       try {
// //         const response = await fetch(url);

// //         if (!response.ok) {
// //           throw new Error(
// //             `Request failed with status ${response.status}`,
// //           );
// //         }

// //         return response;
// //       } catch (error) {
// //         lastError = error;

// //         if (attempt < maxAttempts) {
// //           await this.delay(attempt * 1000);
// //         }
// //       }
// //     }

// //     throw lastError;
// //   }

//   private delay(milliseconds: number): Promise<void> {
//     return new Promise((resolve) =>
//       setTimeout(resolve, milliseconds),
//     );
//   }

//   get stations(): any[] {
//     return this.stationsSubject.value;
//   }
}