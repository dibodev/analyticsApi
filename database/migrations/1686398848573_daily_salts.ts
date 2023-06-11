import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'daily_salts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments()
      table.string('salt', 128).notNullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
