// import { ProductRepository } from "../repositories/product.repository";
// import { AddProductInput } from "../validators/product.validator";
// import { ShopRepository } from "../repositories/shop.repository";

// export class ProductService {
//   static async addProduct(
//     ownerId: string,
//     data: Omit<AddProductInput, "shopId">,
//   ) {
//     const shop = await ShopRepository.findByOwnerId(ownerId);

//     if (!shop) {
//       throw new Error("SHOP_NOT_FOUND");
//     }

//     return await ProductRepository.create({
//       name: data.name,
//       shopId: shop.id,
//       stock: data.stock,
//       price: data.price.toString(),
//       description: data.description ?? undefined,
//     });
//   }
// }

import { ProductRepository } from "../repositories/product.repository";
import { ShopRepository } from "../repositories/shop.repository";
import { AddProductInput } from "../validators/product.validator";

export class ProductService {
  static async addProduct(data: AddProductInput) {
    // 1. In your request, you currently pass a userId.
    // We need to find the actual Shop ID linked to that user.
    const shop = await ShopRepository.findByOwnerId(data.shopId);

    if (!shop) {
      console.error(`No shop found for ownerId: ${data.shopId}`);
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
}
