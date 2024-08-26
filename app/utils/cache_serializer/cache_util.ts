import { BaseModel } from '@adonisjs/lucid/orm'
import { LucidRow } from '@adonisjs/lucid/types/model'

/**
 * @author SPLRGE <victor@splrge.dev>
 * @license MIT
 */
export default class CacheUtil<T extends typeof BaseModel> {
  constructor(protected model: T) {}

  prepareModelToAdapter(row: LucidRow) {
    return Object.keys(row.$attributes).reduce((result: any, key) => {
      const column = this.model.$getColumn(key)!

      result[column.columnName] =
        typeof column.prepare === 'function'
          ? column.prepare(row.$attributes[key], key, row)
          : row.$attributes[key]

      return result
    }, {})
  }
}
