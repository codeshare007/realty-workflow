export class ListingVideoImage {
    constructor(
        public name: string,
        public url: string,
    ) { }
}

export enum FeeType {
    NoFeePaid = 0,
}

export enum IncludeRentType {
    IncludeElectricity = 1,
    IncludeGas = 2,
    IncludeHeat = 3,
    IncludeHotWater = 4,
}

export enum SourceInternal {
    NoInternal = 0,
    Internal = 1,
}

export enum ParkingAvailability {
    Available = 'AVA',
    Garage = 'GAR',
    Included = 'INC',
    Street = 'STR',
}
