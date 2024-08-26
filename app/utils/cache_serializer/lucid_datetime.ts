import { DateTimeColumnDecorator, LucidModel, LucidRow } from '@adonisjs/lucid/types/model'
import { errors } from '@adonisjs/lucid'
import { DateTime } from 'luxon'

export const dateTimeColumn: DateTimeColumnDecorator = (options?) => {
  return function decorateAsColumn(target, property) {
    const Model = target.constructor as LucidModel
    Model.boot()

    const normalizedOptions = Object.assign(
      {
        prepare: (value: any, attributeName: string, modelInstance: LucidRow) => {
          if (typeof value === 'string' || !value) return value

          const model = modelInstance.constructor as LucidModel
          const modelName = model.name

          if (DateTime.isDateTime(value)) {
            if (!value.isValid) {
              throw new errors.E_INVALID_DATE_COLUMN_VALUE([
                `${modelName}.${attributeName}`,
                value.invalidReason,
              ])
            }

            const dateTimeFormat = model.query(modelInstance.$options).client.dialect.dateTimeFormat
            return value.toFormat(dateTimeFormat)
          }

          throw new errors.E_INVALID_DATE_COLUMN_VALUE([
            `${modelName}.${attributeName}`,
            'It must be an instance of "luxon.DateTime"',
          ])
        },
        consume: (value: any, attributeName: string, modelInstance: LucidRow) => {
          if (!value) return value

          const model = modelInstance.constructor as LucidModel

          if (typeof value === 'string') {
            const dateTimeFormat = model.query(modelInstance.$options).client.dialect.dateTimeFormat
            return DateTime.fromFormat(value, dateTimeFormat)
          }

          if (value instanceof Date) {
            return DateTime.fromJSDate(value)
          }

          const modelName = modelInstance.constructor.name
          throw new errors.E_INVALID_DATE_COLUMN_VALUE([
            `${modelName}.${attributeName}`,
            `${typeof value} cannot be formatted`,
          ])
        },
        serialize: (value: DateTime) => {
          if (DateTime.isDateTime(value)) return value.toISO()
          return value
        },
        meta: {},
      },
      options
    )

    normalizedOptions.meta.type = 'datetime'
    normalizedOptions.meta.autoCreate = normalizedOptions.autoCreate === true
    normalizedOptions.meta.autoUpdate = normalizedOptions.autoUpdate === true

    Model.$addColumn(property, normalizedOptions)
  }
}
