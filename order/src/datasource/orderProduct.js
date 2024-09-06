import { DataSource } from "apollo-datasource";
import db from "../db/index.js";

export class OrderProductApi extends DataSource {
  constructor() {
    super();
  }

  async getAllOrderProductsFromDb() {
    try {
      const orderProducts = await db.orderProduct.findMany({
        include: {
          order: true,
        },
      });
      return orderProducts;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async addOrderProductToDb(orderProduct) {
    try {
      const addedProduct = await db.orderProduct.create({
        data: {
          orderProduct,
        },
        include: {
          order: true,
        },
      });
      return addedProduct;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
