import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'servers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()

      table.string('docker_id').nullable()
      table
        .string('type_id')
        .notNullable()
        .references('types.id')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
      table.enum('status', ['OFF', 'LAUNCHING', 'READY', 'ERROR']).notNullable().defaultTo('OFF')
      table.integer('flags').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
