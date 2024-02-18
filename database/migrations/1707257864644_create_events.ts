import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('page_view_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('page_views')
        .onDelete('CASCADE')
        .notNullable()
      table.string('event_type', 100).nullable()
      table.text('event_data').nullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
