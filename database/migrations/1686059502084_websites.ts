import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'websites'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('domain').notNullable().unique()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
