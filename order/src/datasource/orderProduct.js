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
    console.log(orderProduct);
    try {
      const addedProduct = await db.orderProduct.create({
        data: {
          ...orderProduct,
        },
      });
      return addedProduct;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async checkOrderProductExists(orderId, productId) {
    try {
      const orderProduct = await db.orderProduct.findFirst({
        where: {
          AND: [{ orderId }, { productId }],
        },
      });
      return orderProduct;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateOrderProductQuantity(orderId, productId, quantity) {
    try {
      const updatedOrderProduct = await db.orderProduct.update({
        where: {
          orderId_productId: {
            orderId,
            productId,
          },
        },
        data: {
          quantity,
        },
      });
      return updatedOrderProduct;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async deleteOrderProduct(orderId, productId) {
    try {
      const orderDeleted = await db.order.delete({
        where: {
          orderId_productId: {
            orderId,
            productId,
          },
        },
      });
      return orderDeleted;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
