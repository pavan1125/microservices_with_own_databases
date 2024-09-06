export const resolvers={
    Query:{
      getAllInventory:async(_,__,{dataSources})=>{
        try {
          const inventories= await dataSources.inventoryApi.getAllInventoriesFromDb()
          return inventories
        } catch (error) {
          console.log(error)
          return error
        }
      }
    }
}