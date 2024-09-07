import { DataSource } from "apollo-datasource";

export class InventoryApi extends DataSource {
  constructor() {
    super();
    this.URL = "http://localhost:3002/graphql";
  }

  async getInventoryById(id) {
    try {
      const inventory = await fetch(this.URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          query: `
              query {
                getInventoryById(id: "${id}") {
                  id
                  quantity
                  sku
                  product{
                   id
                   sku
                   name
                   price
                  }
                }
              }
            `,
        }),
      });
      const { data } = await inventory.json();
      return data.getInventoryById;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateStock(sku, quantity) {
    try {
      const updated = await fetch(this.URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          query: `
              query {
                updateStock({sku:"${sku}",quantity:"${quantity}"}) {
                  id
                  quantity
                  sku
                  product{
                   id
                   sku
                   name
                   price
                  }
                }
              }
            `,
        }),
      });
      const { data } = await updated.json();
      return data.updateStock;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getInventoryBySku(sku) {
    try {
      const updated = await fetch(this.URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          query: `
              query {
                getInventoryBySku({sku:"${sku}"}) {
                  id
                  quantity
                  sku
                  product{
                   id
                   sku
                   name
                   price
                  }
                }
              }
            `,
        }),
      });
      const { data } = await updated.json();
      return data.getInventoryBySku;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
