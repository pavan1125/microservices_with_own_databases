import { DataSource } from "apollo-datasource";
import db from "../db/index.js";
export class OrderApi extends DataSource {
  constructor() {
    super();
  }

  async getAllOrders() {
    try {
      const orders = await db.order.findMany({
        include: {
          products: true,
        },
      });
      return orders;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async addOrderToDb(order) {
    try {
      const orderCreated = await db.order.create({
        data: {
          ...order,
        },
      });
      return orderCreated;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async checkOrderExists(userId) {
    try {
      const order = await db.order.findFirst({
        where: {
          userId,
        },
      });
      return order;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateOrderTotalAmount(totalAmount, orderId) {
    try {
      const updatedOrder = await db.order.update({
        where: {
          id: orderId,
        },
        data: {
          totalAmount,
        },
      });
      return updatedOrder;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async deleteOrderFromDb(id) {
    try {
      const deleted = await db.order.delete({
        where: {
          id,
        },
      });
      return deleted
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
