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

  async addProductToDb(product) {
    try {
      const addedProduct = await db.product.create({
        data: {
          ...product,
        },
      });
      return addedProduct;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async deleteProductFromDb(sku) {
    try {
      const deleted = await db.product.delete({
        where: {
          sku,
        },
      });
      return deleted;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getProductBySku(sku) {
    try {
      const product = await db.product.findFirst({
        where: {
          sku,
        },
      });
      return product;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
