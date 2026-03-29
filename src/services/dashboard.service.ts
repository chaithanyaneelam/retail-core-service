import { ProductRepository } from "../repositories/product.repository";
import { SaleRepository } from "../repositories/sale.repository";
import { ShopRepository } from "../repositories/shop.repository";

export class DashboardService {
  static async getStats(ownerId: string) {
    const shop = await ShopRepository.findByOwnerId(ownerId);
    if (!shop) throw new Error("SHOP_NOT_FOUND");

    const products = await ProductRepository.getByShopId(shop.id);
    const todaySales = await SaleRepository.getTodaySales(shop.id);

    const totalInventoryValue = products.reduce(
      (acc, p) => acc + Number(p.price) * p.stock,
      0,
    );

    const todayRevenue = todaySales.reduce(
      (acc, s) => acc + Number(s.totalAmount),
      0,
    );

    return {
      shopName: shop.name,
      totalProducts: products.length,
      totalStockValue: totalInventoryValue,
      todaySalesCount: todaySales.length,
      todayRevenue: todayRevenue,
    };
  }
}
