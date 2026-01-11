import OdooApi from "../lib/odooApi"
import IRentalProperty from "../models/IRentalProperty"

const RENTAL_FIELDS = [
    'id',
    'list_price',
    'name',
    'description_sale',
    'image_1920',
    // --- Capacity ---
    'guest_capacity',
    'number_of_bed',
    'number_of_bedrooms',
    'number_of_bathrooms',
    // --- Localization ---
    'street',
    'number_house',
    'postal_code',
    // --- Equipment ---
    'climatization',
    'terrace',
    'garden',
    'swimming_pool',
    'jacuzzi',
    'charge_ev',
    'indoor_fireplace',
    'outdoor_fireplace',
    'dedicated_workspace',
    'gym',
    // --- Accessibility ---
    'toilet_grab_bar',
    'shower_grab_bar',
    'shower_free_access',
    'shower_seat',
    'bedroom_free_access',
    'bedroom_large_door',
    'general_free_access'
]

export class RentalPropertyRepository {
    private api: OdooApi
    private model = 'product.template'
    
    constructor() {
        this.api = OdooApi.getInstance()
    }

    async create(rentalProperty: IRentalProperty) : Promise<number> {
        return await this.api.call(
            this.model,
            'create',
            [rentalProperty]
        )
    }

    async update(id: number, rentalProperty: IRentalProperty) : Promise<boolean> {
        return await this.api.call(
            this.model,
            'write',
            [[id], rentalProperty]
        )
    }

    async delete(id: number) : Promise<boolean> {
        return await this.api.call(
            this.model,
            'unlink',
            [[id]]
        )
    }

    async findAll(limit: number = 30) : Promise<IRentalProperty[]> {
        return await this.api.call(
            this.model,
            'search_read',
            [[]],
            { fields: RENTAL_FIELDS, limit }
        )
    }

    async findById(id: number) : Promise<IRentalProperty | null> {
        const result = await this.api.call(
            this.model,
            'read',
            [[id]],
            { fields: RENTAL_FIELDS }
        )

        if (result && Array.isArray(result) && result.length > 0) {
            return result[0] as IRentalProperty
        }
        return null
    }

}