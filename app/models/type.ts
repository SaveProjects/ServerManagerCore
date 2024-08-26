import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { createId } from '@paralleldrive/cuid2'

export default class Type extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare dockerImage: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async generateId(type: Type) {
    type.id = createId()
  }
}
