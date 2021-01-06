import React, { useState, useContext, createContext } from 'react';
import productData from './product-data.json';

let id = 3;
function generateId() {
  id++;
  return id;
};

const ProductContext = createContext();
const useProducts = () => useContext(ProductContext);

function ProductProvider({ children }) {
  const [products, setProducts] = useState(productData);
  const handleQuantityChange = (id, quantity) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, quantity } : product
      )
    );
  };
  const handleIncrement = (id, quantity) => {
    quantity = quantity + 1;
    handleQuantityChange(id, quantity);
  };
  const handleDecrement = (id, quantity) => {
    if(quantity === 0) {
      return;
    }
    quantity = quantity - 1;
    handleQuantityChange(id, quantity);
  };
  const addItem = (name, purchasePrice, sellPrice, quantity, category, locations) => {
    setProducts([
      ...products,
      {
        "id": generateId(),
        "name": name,
        "price": { 
          "purchasePrice": purchasePrice,
          "sellPrice": sellPrice
        },
        "quantity": quantity,
        "category": category,
        "locations": [ 
          locations
        ]
      }
    ]);
  }
    
  return (
    <ProductContext.Provider value={{ products, handleIncrement, handleDecrement, addItem }}>
      {children}
    </ProductContext.Provider>
  );
}

export { useProducts, ProductProvider }