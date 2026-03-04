import axios from "axios";
import { error } from "node:console";

export class locationService {
  static async getCoordsFromAddress(address: String) {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: { q: address, format: "json", limit: 1 },
      },
    );
    if (response.data === 0) throw new Error("Location not found");

    return {
      lat: parseFloat(response.data[0].lat),
      lng: parseFloat(response.data[0].lon),
    };
  }
}
