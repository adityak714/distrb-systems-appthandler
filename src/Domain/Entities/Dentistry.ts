import {IDentistry} from './../Intefaces/IDentistry'
import { ICoordinate } from '../Intefaces/ICoordinate';
import { IOpeningHours } from '../Intefaces/IOpeningHours';
export class Dentistry implements IDentistry {
    id: Number;
    name: string;
    owner: string;
    dentists: Number;
    address: string;
    city: string;
    coordinate: ICoordinate;
    openinghours: IOpeningHours;
    constructor(id:Number, name: string, owner: string, dentists: Number, address: string, city: string, coordinate: ICoordinate, openinghours:IOpeningHours) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.dentists = dentists;
        this.address = address;
        this.city = city;
        this.coordinate = coordinate;
        this.openinghours = openinghours;
    }
}