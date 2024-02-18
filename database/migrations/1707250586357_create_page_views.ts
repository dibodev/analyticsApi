import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'page_views'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('visitor_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('visitors')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('page_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('pages')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('user_agent_id')
        .index()
        .unsigned()
        .references('id')
        .inTable('user_agents')
        .nullable()
        .onDelete('CASCADE')
      table.timestamp('session_start', { useTz: true }).notNullable()
      table.timestamp('session_end', { useTz: true }).nullable()
      table.integer('duration').defaultTo(0).notNullable()
      table.string('referrer', 2048).nullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
