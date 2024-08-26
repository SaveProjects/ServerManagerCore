import TypeService from '#services/type_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { createTypeValidator, updateTypeValidator } from '#validators/type'

@inject()
export default class TypesController {
  constructor(protected typeService: TypeService) {}

  async index({ response }: HttpContext) {
    const types = await this.typeService.fetchTypes()
    return response.ok(types)
  }

  async show({ response, params }: HttpContext) {
    const type = await this.typeService.fetchType(params.id)
    return response.ok(type)
  }

  async store({ request, response }: HttpContext) {
    const body = await request.validateUsing(createTypeValidator)

    const type = await this.typeService.createType(body)
    return response.created(type)
  }

  async update({ request, response, params }: HttpContext) {
    const body = await request.validateUsing(updateTypeValidator)
    const type = await this.typeService.updateType(params.id, body)

    return response.ok(type)
  }

  async destroy({ response, params }: HttpContext) {
    await this.typeService.deleteType(params.id)
    return response.noContent()
  }
}
