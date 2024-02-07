import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateVisitorIps extends BaseSchema {
  protected tableName = 'visitor_ips'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('ip', 45).notNullable().unique()
      table.integer('location_id').unsigned().index().references('id').inTable('locations')
      table.string('type', 10).notNullable()
      table.integer('asn')
      table.string('org', 100)
      table.string('isp', 100)
      table.string('domain', 100)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
