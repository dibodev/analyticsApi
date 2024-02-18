import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'visitor_events'

  public async up() {
    this.schema.dropTable(this.tableName)
  }

  public async down() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments()
      table.integer('visitor_id').unsigned().references('visitors.id').onDelete('CASCADE')
      table.string('browser').nullable()
      table.string('os').nullable()
      table.string('url').nullable()
      table.string('device_type').nullable()
      table.string('referrer').nullable()
      table.timestamps(true, true)
    })
  }
}
