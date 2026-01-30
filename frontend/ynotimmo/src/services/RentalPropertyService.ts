// src/services/PropertyService.ts
import type IRentalProperty from '../types/IRentalProperty'

class RentalPropertyService {
  private static baseUrl = 'http://localhost:3000/api/rentalProperty'

  /**
   * getAll properties
   */
  static async getAllProperties(): Promise<IRentalProperty[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getAll`)
      console.log(response)
      if (!response.ok) {
        throw new Error('Error fetching properties from the API')
      }

      const data = await response.json()
      console.log(data)
      return data as IRentalProperty[]
    } catch (error) {
      console.error('Erreur API:', error)
      return []
    }
  }

  static async importProperty(
    propertyData: IRentalProperty
  ): Promise<IRentalProperty> {
    try {
      const response = await fetch(`${this.baseUrl}/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      })

      if (!response.ok) {
        throw new Error(`Error creating property: ${response.statusText}`)
      }
      return (await response.json()) as IRentalProperty
    } catch (error) {
      console.error('Error creating property:', error)
      throw error
    }
  }

  static async importPropertiesFromJson(
    properties: IRentalProperty[]
  ): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/import-json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      })

      const responseData = await response.json()

      if (!response.ok && response.status >= 500) {
        throw new Error(
          responseData.error || `Erreur serveur: ${response.statusText}`
        )
      }
      return responseData
    } catch (error) {
      console.error('Error importing properties:', error)
      throw error
    }
  }
}

export default RentalPropertyService
