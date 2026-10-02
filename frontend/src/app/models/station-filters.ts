export interface StationFilters {
    searchText: string | null;
    elevationMin: number | null;
    elevationMax: number | null;

    latitudeMin: number | null;
    latitudeMax: number | null;

    longitudeMin: number | null;
    longitudeMax: number | null;

    stationStatus: string | null;
}