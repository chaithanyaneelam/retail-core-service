import { ProductRepository } from "../repositories/product.repository";
import { ShopRepository } from "../repositories/shop.repository";
import { AddProductInput } from "../validators/product.validator";

export class ProductService {
  static async addProduct(data: AddProductInput, ownerId: string) {
    // 1. In your request, you currently pass a userId.
    // We need to find the actual Shop ID linked to that user.
    const shop = await ShopRepository.findByOwnerId(ownerId);

    if (!shop) {
      console.error(`No shop found for ownerId: ${ownerId}`);
      throw new Error("SHOP_NOT_FOUND");
    }

    // 2. Now use the real Shop ID from the database to create the product
    return await ProductRepository.create({
      name: data.name,
      shopId: shop.id, // We use the actual Shop's UUID here
      stock: data.stock,
      price: data.price.toString(),
      description: data.description ?? undefined,
    });
  }
  static async getShopInventory(ownerId: string) {
    const shop = await ShopRepository.findByOwnerId(ownerId);
    if (!shop) {
      throw new Error("SHOP_NOT_FOUND");
    }
    const products = await ProductRepository.getByShopId(shop.id);

    const totalValue = products.reduce(
      (acc, p) => acc + Number(p.price) * p.stock,
      0,
    );

    const inventoryWithAlerts = products.map((p) => ({
      ...p,
      isLowStock: p.stock < 5,
    }));

    return {
      shopName: shop.name,
      inventoryValue: totalValue,
      productCount: products.length,
      products: inventoryWithAlerts,
    };
  }

  static async updateProduct(
    id: string,
    ownerId: string,
    data: { name?: string; price?: number },
  ) {
    const shop = await ShopRepository.findByOwnerId(ownerId);
    if (!shop) throw new Error("SHOP_NOT_FOUND");

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.price !== undefined) updateData.price = data.price.toString();

    return await ProductRepository.update(id, shop.id, updateData);
  }

  static async deleteProduct(id: string, ownerId: string) {
    const shop = await ShopRepository.findByOwnerId(ownerId);
    if (!shop) throw new Error("SHOP_NOT_FOUND");

    return await ProductRepository.delete(id, shop.id);
  }
}
