import ItemService from '../services/item.service'
import type { FastifyInstance } from 'fastify'
import type {
  ItemCreateRequest,
  ItemParamsRequest,
  ItemPatchByIdRequest
} from '../schemas/item.schema'

class ItemController {
  itemService: ItemService

  constructor(fastify: FastifyInstance) {
    this.itemService = new ItemService(fastify)
  }

  async getAll() {
    return this.itemService.getAll()
  }

  async create(req: ItemCreateRequest) {
    const result = await this.itemService.create(req.body)
    return result[0]
  }

  async getById(req: ItemParamsRequest) {
    return this.itemService.getById(req.params.id)
  }

  async patchById(req: ItemPatchByIdRequest) {
    return this.itemService.patchById(req.params.id, req.body)
  }

  async deleteById(req: ItemParamsRequest) {
    return this.itemService.deleteById(req.params.id)
  }
}

export default ItemController
