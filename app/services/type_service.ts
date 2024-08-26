import Type from '#models/type'
import { TypeCreation, TypeUpdate } from '#validators/type'

export default class TypeService {
  async fetchTypes(): Promise<Type[]> {
    return Type.all()
  }

  async fetchType(id: string): Promise<Type | null> {
    return Type.find(id)
  }

  async fetchTypeOrFail(id: string): Promise<Type> {
    return Type.findOrFail(id)
  }

  async createType(body: TypeCreation): Promise<Type> {
    return Type.create(body)
  }

  async updateType(type: Type, body: TypeUpdate): Promise<Type> {
    type.merge(body)
    await this.saveType(type)

    return type
  }

  async saveType(type: Type): Promise<Type> {
    await type.save()
    return type
  }

  async deleteType(type: Type): Promise<void> {
    await type.delete()
  }
}
