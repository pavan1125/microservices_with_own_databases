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