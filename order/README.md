createOrder
``
{
    "query":"mutation {addOrder(order:{totalAmount:0,status:PENDING}){id,orderNumber,totalAmount,status,userId}}"
}
``
getAllOrders
``
{
    "query":"query {getAllOrders {id,orderNumber,totalAmount,status,userId,user{id,name,password}}}"
}
``

addOrderProduct
```
{
  "query": "mutation { addOrderProduct(orderProduct:{orderId:\"12312312312312321\",productId:\"a3eae06c-b9ff-44e4-bc1f-e379eabc86ff\"}) { productId,orderId  }  }"
}
```
 get all orderProducts
 ```
 