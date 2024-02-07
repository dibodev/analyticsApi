import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'locations'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.decimal('latitude', 10, 8).notNullable().alter()
      table.decimal('longitude', 11, 8).notNullable().alter()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.decimal('latitude', 10, 8).nullable().alter()
      table.decimal('longitude', 11, 8).nullable().alter()
    })
  }
}
