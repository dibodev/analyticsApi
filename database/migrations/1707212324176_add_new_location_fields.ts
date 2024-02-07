import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddNewLocationFields extends BaseSchema {
  protected tableName: string = 'locations'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('alpha_3')
      table.string('continent', 50).nullable().after('id')
      table.string('continent_code', 10).nullable().after('continent')
      table.string('country', 50).nullable().alter().after('continent_code')
      table.string('country_code', 10).nullable().after('country')
      table.string('region', 50).nullable().alter().after('country_code')
      table.string('region_code', 10).nullable().after('region')
      table.string('city', 50).notNullable().alter().after('region_code')
      table.decimal('latitude', 10, 8).nullable().after('city')
      table.decimal('longitude', 11, 8).nullable().after('latitude')
      table.string('postal', 20).nullable().after('longitude')
      table.string('flag_img_url', 255).nullable().after('postal')
      table.string('flag_emoji', 50).nullable().after('flag_img_url')

      // Edit unique constraints
      table.dropUnique(['country', 'region', 'city'])
      table.unique(['latitude', 'longitude'])
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      // Delete new columns
      table.dropColumn('continent')
      table.dropColumn('continent_code')
      table.dropColumn('country_code')
      table.dropColumn('region_code')
      table.dropColumn('latitude')
      table.dropColumn('longitude')
      table.dropColumn('postal')
      table.dropColumn('flag_img_url')
      table.dropColumn('flag_emoji')

      // Restore the initial unique constraint
      table.unique(['country', 'region', 'city'])
    })
  }
}
