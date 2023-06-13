import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'visitors'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments()
      table.string('visitor_id').notNullable().unique()
      table.integer('project_id').unsigned().references('projects.id')
      table.integer('location_id').unsigned().references('locations.id')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
