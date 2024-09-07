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

  async getInventoryByIdFromDb(id) {
    try {
      const inventory = await db.inventory.findFirst({
        where: {
          id,
        },
      });
      return inventory;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateStockBySkuInDb(sku,quantity){
    try {
      const updatedInventory= await db.inventory.update({
        where:{
          sku
        },
        data:{
          quantity
        }
      })
      return updatedInventory
    } catch (error) {
      console.log(error)
      return error
    }
  }
}
