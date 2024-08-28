import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

const typeNameRule = vine.string().unique(async (db, value) => {
  const user = db.from('types').where('name', value).first()
  return !user
})

export const createTypeValidator = vine.compile(
  vine.object({
    name: typeNameRule,
    dockerImage: vine.string(),
    externalImage: vine.boolean().optional(),
  })
)

export const updateTypeValidator = vine.compile(
  vine.object({
    name: typeNameRule.optional(),
    dockerImage: vine.string().optional(),
    externalImage: vine.boolean().optional(),
  })
)

export type TypeCreation = Infer<typeof createTypeValidator>
export type TypeUpdate = Infer<typeof updateTypeValidator>
