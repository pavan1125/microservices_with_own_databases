import { DataSource } from "apollo-datasource";

export class ProductApi extends DataSource {
  constructor() {
    super();
    this.URL = "http://localhost:3002/graphql";
  }

  async getProductById(id) {
    try {
      const product = await fetch(this.URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
            query: `
              query {
                getProductById(id: "${id}") {
                  id
                  name
                  description
                  price
                  sku
                  inventory{
                   id
                   sku
                   quantity
                  }
                }
              }
            `,
          }),
      });
    } catch (error) {}
  }
}
