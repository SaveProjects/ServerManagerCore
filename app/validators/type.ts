import vine from '@vinejs/vine'
import { Infer } from "@vinejs/vine/types";

export const createTypeValidator = vine.compile(vine.object({
  name: vine.string(),
  dockerImage: vine.string(),
  externalImage: vine.boolean().optional()
}))

export const updateTypeValidator = vine.compile(vine.object({
  name: vine.string().optional(),
  dockerImage: vine.string().optional(),
  externalImage: vine.boolean().optional()
}))

export type TypeCreation = Infer<typeof createTypeValidator>
export type TypeUpdate = Infer<typeof updateTypeValidator>
