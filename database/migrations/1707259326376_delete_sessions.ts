import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sessions'

  public async up() {
    this.schema.dropTable(this.tableName)
  }

  public async down() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments()
      table
        .integer('visitor_id')
        .unsigned()
        .references('id')
        .inTable('visitors')
        .onDelete('CASCADE')
      table.boolean('active').defaultTo(true)
      table.timestamp('session_start', { useTz: true })
      table.timestamp('session_end', { useTz: true }).nullable()
      table.integer('visit_duration').nullable()
      table.timestamps(true, true)
    })
  }
}
