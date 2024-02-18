import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'visitors'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table
        .integer('visitor_ip_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('visitor_ips')
        .after('id')
      table.dropColumn('visitor_id')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['visitor_ip_id'])
      table.dropColumn('visitor_ip_id')
      table.string('visitor_id').notNullable().unique()
    })
  }
}
