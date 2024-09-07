import { generateRandomString } from "../utils/common.js";
import { kafka } from "./index.js";
export const orderProductConsumer = async (dataSources) => {
  const consumer = kafka.consumer({ groupId: "order-product-group" });
  await consumer.connect();
  await consumer.subscribe({
    topics: [
      "order_product_added",
      "order_product_deleted",
      "order_deleted",
      "order_status_updated",
    ],
    fromBeginning: true,
  });
  return await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const messageValue = JSON.parse(message.value);
        console.log("🚀 ~ eachMessage: ~ messageValue:", messageValue);

        if (topic === "order_status_updated") {
          console.log("asdas", messageValue);
          if (messageValue.status === "PENDING") {
            return;
          }
          if (messageValue.status === "SHIPPED") {
            const products = messageValue.products;
            products.forEach(async (product) => {
              const pro = await dataSources.productApi.getProductById(
                product.productId
              );
              const inventory =
                await dataSources.inventoryApi.getInventoryBySku(pro.sku);
              console.log({ pro, inventory });
              const stockNeedToRemove = product.quantity;
              const updatedStock = inventory.quantity - stockNeedToRemove;
              await dataSources.inventoryApi.updateStock(
                inventory.sku,
                updatedStock
              );
            });
          }
          if (messageValue.status === "DELIVERED") {
            return;
          }
          if (messageValue.status === "CANCELLED") {
            return;
          }
          return;
        }
        if (topic === "order_deleted") {
          const orderProducts = messageValue.products;
          if (
            messageValue.status === "PENDING" &&
            Array.isArray(orderProducts)
          ) {
            orderProducts.forEach(async (order) => {
              await dataSources.orderProductsApi.deleteOrderProduct(
                order.orderId,
                order.productId
              );
            });
          } else if (
            messageValue.status === "SHIPPED" &&
            Array.isArray(orderProducts)
          ) {
            //add the quantity back to the stock in inventory
            orderProducts.forEach(async (order) => {
              const product = await dataSources.productApi.getProductById(
                order.productId
              );
              await dataSources.inventoryApi.updateStock(
                product.sku,
                order.quantity
              );
              // await fetch(
              //   `http://localhost:3002/inventory/${product.sku}/stock`,
              //   {
              //     method: "POST",
              //     body: JSON.stringify({ quantity: order.quantity }),
              //   }
              // );
              await dataSources.orderProductsApi.deleteOrderProduct(
                order.orderId,
                order.productId
              );
            });
          }
          return await dataSources.ordersApi.deleteOrderFromDb(messageValue.id);
        }

        // check weather the inventory has stock or not using the kafka event and consume it before order product is added to db and manage the order product , adjust the total price of the order
        const orderExists = await dataSources.ordersApi.checkOrderExists(
          messageValue.userId
        );
        const orderProductExists =
          await dataSources.orderProductsApi.checkOrderProductExists(
            orderExists.id,
            messageValue.orderProduct.productId
          );
        const product = await dataSources.productApi.getProductById(
          messageValue.orderProduct.productId
        );
        // const response = await fetch(
        //   `http://localhost:3002/product/productId/${messageValue.orderProduct.productId}`,
        //   {
        //     method: "GET",
        //   }
        // );
        // const product = await response.json();
        if (topic === "order_product_deleted") {
          // if orderProduct is deleted update the order
          const deletedQuantity = messageValue.quantity;
          const deletedProductPrice = product.price;
          const totalPrice = orderExists.totalAmount;
          const updatedPrice =
            totalPrice - deletedQuantity * deletedProductPrice;
          await dataSources.ordersApi.updateOrderTotalAmount(
            updatedPrice,
            messageValue.orderId
          );
          return;
        }
        if (orderProductExists) {
          // add the quantity to the order product and update the latest total amount to the order
          const quantity = messageValue.orderProduct.quantity;
          const updatedOrderProduct =
            await dataSources.orderProductsApi.updateOrderProductQuantity(
              orderExists.id,
              messageValue.orderProduct.productId,
              quantity + orderProductExists.quantity
            );
          if (updatedOrderProduct) {
            const current_amount = orderExists.totalAmount;
            const updated_amount =
              current_amount + Number(product.price) * Number(quantity);
            await dataSources.ordersApi.updateOrderTotalAmount(
              updated_amount,
              orderExists.id
            );
          }
          return;
        }
        if (!orderExists) {
          const order = {
            orderNumber: generateRandomString(6),
            totalAmount: 0,
            status: "PENDING",
            userId: messageValue.userId,
          };
          const orderAdded = await dataSources.ordersApi.addOrderToDb(order);
          orderProduct.orderId = orderAdded.id;
          const currentTotalAmount = 0;
          const product_added_total_price =
            Number(currentTotalAmount) +
            Number(orderProduct.quantity) * Number(product.price);
          const orderProductAdded =
            await dataSources.orderProductsApi.addOrderProductToDb(
              orderProduct
            );
          if (orderProductAdded) {
            await dataSources.ordersApi.updateOrderTotalAmount(
              product_added_total_price,
              orderAdded.id
            );
          }
          return orderProductAdded;
        } else {
          const orderProduct = messageValue.orderProduct;
          orderProduct.orderId = orderExists.id;
          const currentTotalAmount = orderExists.totalAmount;
          const product_added_total_price =
            Number(currentTotalAmount) +
            Number(messageValue.orderProduct.quantity) * Number(product.price);
          const orderProductAdded =
            await dataSources.orderProductsApi.addOrderProductToDb(
              orderProduct
            );
          if (orderProductAdded) {
            await dataSources.ordersApi.updateOrderTotalAmount(
              product_added_total_price,
              messageValue.orderProduct.orderId
            );
          }
          return orderProductAdded;
        }
      } catch (error) {
        console.log(error);
        return error;
        // await handleProducerError(error);
      }
    },
  });
};
