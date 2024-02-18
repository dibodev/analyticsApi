import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'real_time_page_views'

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
      table.boolean('active').defaultTo(true)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
