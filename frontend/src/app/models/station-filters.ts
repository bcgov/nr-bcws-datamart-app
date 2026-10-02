export interface StationFilters {
  elevationMin: number | null;
  elevationMax: number | null;

  latitudeOperator: 'gt' | 'lt' | 'eq';
  latitudeValue: number | null;

  longitudeOperator: 'gt' | 'lt' | 'eq';
  longitudeValue: number | null;
}