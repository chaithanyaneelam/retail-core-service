import { ShopRepository } from "../repositories/shop.repository";
import { UserRepository } from "../repositories/user.repository";

export class CustomerService {
  static async getNearbyShopsForUser(userId: string) {
    const userLocation = await UserRepository.findLocationByUserId(userId);

    if (!userLocation) {
      throw new Error("USER_LOCATION_NOT_FOUND");
    }

    const shops = await ShopRepository.findNearby(
      userLocation.lat,
      userLocation.lng,
    );

    if (!shops || shops.length === 0) {
      throw new Error("NO_SHOPS_FOUND");
    }
    return shops;
  }
}
