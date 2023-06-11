import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'locations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments()
      table.string('country').notNullable()
      table.string('region').notNullable()
      table.string('city').notNullable()
      table.unique(['country', 'region', 'city']) // Add unique constraint
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
