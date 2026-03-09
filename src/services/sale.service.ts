import { SaleRepository } from "../repositories/sale.repository";
import { CreateSaleInput } from "../validators/sale.validator";

export class SaleService {
  static async processSale(data: CreateSaleInput) {
    return await SaleRepository.create(data);
  }
}
