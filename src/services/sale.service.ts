import { SaleRepository } from "../repositories/sale.repository";
import { ShopRepository } from "../repositories/shop.repository";
import { CreateSaleInput } from "../validators/sale.validator";

export class SaleService {
  static async processSale(data: CreateSaleInput, ownerId: string) {
    const shop = await ShopRepository.findByOwnerId(ownerId);
    if (!shop) throw new Error("SHOP_NOT_FOUND");

    return await SaleRepository.create({
      productId: data.productId,
      quantity: data.quantity,
      shopId: shop.id,
    });
  }

  static async getShopSaleHistory(ownerId: string) {
    const shop = await ShopRepository.findByOwnerId(ownerId);
    if (!shop) {
      throw new Error("SHOP_NOT_FOUND");
    }

    const sales = await SaleRepository.getByShopId(shop.id);

    const totalRevenue = sales.reduce(
      (acc, sale) => acc + Number(sale.totalAmount),
      0,
    );

    return {
      shopName: shop.name,
      totalRevenue,
      transactionCount: sales.length,
      sales,
    };
  }
}
