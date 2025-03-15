import ItemService from '../services/item.service'
import type { FastifyInstance } from 'fastify'
import type {
  ItemCreateRequest,
  ItemCreateResponse,
  ItemParamsRequest,
  ItemGetByIdResponse,
  ItemPatchByIdRequest,
  ItemPatchByIdResponse,
  ItemDeleteByIdResponse
} from '../schemas/item.schema'

class ItemController {
  itemService: ItemService

  constructor(fastify: FastifyInstance) {
    this.itemService = new ItemService(fastify)
  }

  async getAll() {
    return this.itemService.getAll()
  }

  async create(req: ItemCreateRequest, res: ItemCreateResponse) {
    const result = await this.itemService.create(req.body)
    return result[0]
  }

  async getById(req: ItemParamsRequest, res: ItemGetByIdResponse) {
    return this.itemService.getById(req.params.id)
  }

  async patchById(req: ItemPatchByIdRequest, res: ItemPatchByIdResponse) {
    return this.itemService.patchById(req.params.id, req.body)
  }

  async deleteById(req: ItemParamsRequest, res: ItemDeleteByIdResponse) {
    return this.itemService.deleteById(req.id)
  }
}

export default ItemController
