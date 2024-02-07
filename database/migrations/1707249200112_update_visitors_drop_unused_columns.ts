import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'visitors'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign(['location_id'])
      table.dropColumn('location_id')
      table.dropForeign(['project_id'])
      table
        .integer('project_id')
        .notNullable()
        .unsigned()
        .index()
        .references('projects.id')
        .onDelete('CASCADE')
        .alter()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.integer('location_id').unsigned().index().references('locations.id').onDelete('CASCADE')
      table
        .integer('project_id')
        .unsigned()
        .index()
        .references('projects.id')
        .onDelete('CASCADE')
        .alter()
    })
  }
}
