// src/services/PropertyService.ts
import type IRentalProperty from "../types/IRentalProperty";

class RentalPropertyService {
    private static API_URL = "http://localhost:3000/api/rentalProperty/getAll"; 

    /**
     * getAll properties
     */
    static async getAllProperties(): Promise<IRentalProperty[]> {
        try {
            const response = await fetch(this.API_URL);
            console.log(response)
            if (!response.ok) {
                throw new Error('Error fetching properties from the API');
            }

            

            const data = await response.json();
            console.log(data)
            return data as IRentalProperty[];
            
        } catch (error) {
            console.error("Erreur API:", error);
            return [];
        }
    }
}

export default RentalPropertyService;