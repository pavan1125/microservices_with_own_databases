import {DataSource} from "apollo-datasource"
import db from "../db/index.js"
export class OrderApi extends DataSource{
    constructor(){
        super()
    }

   async getAllOrders(){
        try {
            const orders= await db.order.findMany()
            return orders
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async addOrder(order){
        try {
            const orderCreated= await db.order.create({
                data:{
                    order
                }
            })
            return orderCreated
        } catch (error) {
           console.log(error)
           return error 
        }
    }
}

