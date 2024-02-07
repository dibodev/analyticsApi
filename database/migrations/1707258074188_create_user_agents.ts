import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_agents'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('user_agent', 2048).nullable()
      table.string('browser_name', 255).nullable()
      table.string('browser_version', 255).nullable()
      table.string('browser_language', 50).nullable()
      table.string('os_name', 255).nullable()
      table.string('os_version', 255).nullable()
      table.string('device_type', 255).nullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
