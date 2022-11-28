export interface IDentistry {
    id: Number,
    name: string,
    owner: string,
    dentists: Number,
    address: string,
    city: string,
    coordinate: {
        latitude: Number,
        longitude: Number
    },
    openinghours: {
        monday: string,
        tuesday: string,
        wednesday: string,
        thursday: string,
        friday: string
    }
}