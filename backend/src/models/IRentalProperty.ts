export default interface IRentalProperty {
    id?: number
    list_price?: number
    name?: string
    description_sale?: string
    image_1920?: string

    // --- Capacity ---
    guest_capacity?: number
    number_of_bed?: number
    number_of_bedrooms?: number
    number_of_bathrooms?: number

    // --- Localization ---
    street?: string
    number_house?: string
    postal_code?: string

    // --- Equipment ---
    climatization?: boolean
    terrace?: boolean
    garden?: boolean
    swimming_pool?: boolean
    jacuzzi?: boolean
    charge_ev?: boolean
    indoor_fireplace?: boolean
    outdoor_fireplace?: boolean
    dedicated_workspace?: boolean
    gym?: boolean

    // --- Accessibility ---
    toilet_grab_bar?: boolean
    shower_grab_bar?: boolean
    shower_free_access?: boolean
    shower_seat?: boolean
    bedroom_free_access?: boolean
    bedroom_large_door?: boolean
    general_free_access?: boolean
}