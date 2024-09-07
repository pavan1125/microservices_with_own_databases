add product 
```
{
  "query": "mutation { addProduct(product:{name:\"test\",description:\"test\",price:1125,sku:\"test\"}) { id,name  }  }"
}
```

getAllProducts
```
{
  "query": "query { getAllProducts { id,name  }  }"
}
```

get product by id
```
{
  "query": "query { getProductById(id:\"a3eae06c-b9ff-44e4-bc1f-e379eabc86ff\") { id,name  }  }"
}
```

get inventory by id
```
{
  "query": "query { getInventoryById(id:\"12121212q\") { sku,id  }  }"
}
```