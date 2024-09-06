import { DataSource } from "apollo-datasource";
import { db } from "../../db/index.js";
export class InventoryApi extends DataSource {
  constructor() {
    super();
  }

  async getAllInventoriesFromDb() {
    try {
      const products = await db.inventory.findMany({
        include: {
          product: true,
        },
      });
      return products;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
