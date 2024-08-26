import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { createId } from '@paralleldrive/cuid2'
import Type from '#models/type'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Server extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare dockerId: string | undefined

  @column()
  declare typeId: string

  @belongsTo(() => Type, { localKey: 'typeId', foreignKey: 'id' })
  declare type: BelongsTo<typeof Type>

  @column()
  declare status: 'OFF' | 'LAUNCHING' | 'READY' | 'ERROR'

  @column()
  declare flags: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async generateId(type: Type) {
    type.id = createId()
  }
}
