import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName: string = 'visitors'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // first, remove existing foreign key constraint
      table.dropForeign(['project_id'])

      // recreate foreign key constraint with not nullable
      table
        .integer('project_id')
        .unsigned()
        .references('projects.id')
        .onDelete('CASCADE')
        .notNullable()
        .alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Remove foreign key constraint with cascade
      table.dropForeign(['project_id'])

      // Recreate the original foreign key constraint
      table.integer('project_id').unsigned().references('projects.id').onDelete('CASCADE').alter()
    })
  }
}
