import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreatePages extends BaseSchema {
  protected tableName = 'pages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('url', 2048).notNullable().unique()
      table.string('endpoint', 255)
      table
        .integer('project_id')
        .notNullable()
        .unsigned()
        .index()
        .references('id')
        .inTable('projects')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
