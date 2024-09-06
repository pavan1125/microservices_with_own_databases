import {RemoteGraphQLDataSource} from "@apollo/gateway"

export class UsersAPI {
    constructor() {
      this.baseURL = 'http://localhost:3003/graphql';
    }
  
    async getUserById(id) {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              getUserById(id: "${id}") {
                id
                name
              }
            }
          `,
        }),
      });
  
      const { data } = await response.json();
      return data.getUserById;
    }
  }
