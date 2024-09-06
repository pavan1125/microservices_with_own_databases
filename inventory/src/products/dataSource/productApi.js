import { DataSource } from "apollo-datasource";
import { db } from "../../db/index.js";
export class ProductApi extends DataSource {
  constructor() {
    super();
  }

  async getAllProductsFromDb() {
    try {
      const products = await db.product.findMany({
        include: {
          inventory: true,
        },
      });
      return products;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getProductByIdFromDb(id) {
    try {
      const product = await db.product.findFirst({
        where: {
          id,
        },
        include: {
          inventory: true,
        },
      });
      return product;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
