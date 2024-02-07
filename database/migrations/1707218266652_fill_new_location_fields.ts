import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Database from '@ioc:Adonis/Lucid/Database'
import GeoMigrationService from 'Database/services/migrations/GeoMigrationService'
import type { LocationInfo } from 'Database/services/migrations/GeoMigrationService'
import Location from 'App/Models/Location'

export default class FillNewLocationFields extends BaseSchema {
  protected tableName: string = 'locations'
  protected visitorEventsTableName: string = 'visitor_events'

  public async up() {
    // Update flag emoji for accept emoji characters
    await Database.rawQuery(
      'ALTER TABLE `locations` CHANGE `flag_emoji` `flag_emoji` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;'
    )

    const locations: Array<Location> = await Database.from(this.tableName).select('*')

    for (const location of locations) {
      try {
        const updatedInfo: LocationInfo | null = await GeoMigrationService.getLocationInfoByCity(
          location.city
        )

        if (updatedInfo) {
          await Database.from(this.tableName).where('id', location.id).update({
            continent: updatedInfo.continent,
            continent_code: updatedInfo.continent_code,
            country_code: updatedInfo.country_code,
            region_code: updatedInfo.region_code,
            latitude: updatedInfo.latitude,
            longitude: updatedInfo.longitude,
            postal: updatedInfo.postal,
            flag_img_url: updatedInfo.flag_img_url,
            flag_emoji: updatedInfo.flag_emoji,
          })
        }
      } catch (error) {
        console.error(`Error updating location ${location.id}:`, error)
      }
    }

    // Remove rows with missing essential information ( delete cascade )
    await Location.query().whereNull('latitude').orWhereNull('longitude').delete()
  }

  public async down() {
    // Revert back to the previous character set and collation
    await Database.rawQuery(
      'ALTER TABLE `locations` CHANGE `flag_emoji` `flag_emoji` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL;'
    )
  }
}
