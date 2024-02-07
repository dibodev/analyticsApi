import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName: string = 'visitor_events'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // First remove existing foreign key constraint
      table.dropForeign(['visitor_id'])

      // Recreate foreign key constraint with onDelete('CASCADE')
      table.integer('visitor_id').unsigned().references('visitors.id').onDelete('CASCADE').alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Remove foreign key constraint with cascade
      table.dropForeign(['visitor_id'])

      // Recreate the original foreign key constraint
      table.integer('visitor_id').unsigned().references('visitors.id').alter()
    })
  }
}
