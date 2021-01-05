import React, { useState, useContext, createContext } from "react";
import "./App.css";

let productData = [
  {
    id: 1,
    name: "Rice Cooker",
    price: {
      purchasePrice: 999,
      sellPrice: 1299,
    },
    quantity: 4,
    categoryId: "Appliances",
    locations: ["Inventory Room 1"],
  },
  {
    id: 2,
    name: "Flour",
    price: {
      purchasePrice: 49,
      sellPrice: 67,
    },
    quantity: 10,
    categoryId: "Raw Material",
    locations: ["Inventory Room 2"],
  },
  {
    id: 3,
    name: "Choco Chips",
    price: {
      purchasePrice: 89,
      sellPrice: 110,
    },
    quantity: 8,
    categoryId: "Food",
    locations: ["Inventory Room 3"],
  },
];

const ProductContext = createContext();
const useProducts = () => useContext(ProductContext);

export function ProductProvider({ children }) {
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
    
  return (
    <ProductContext.Provider value={{ products, handleIncrement, handleDecrement }}>
      {children}
    </ProductContext.Provider>
  );
}

function Product({ id, name, price, quantity }) {
  const { handleDecrement, handleIncrement } = useProducts();
  return (
    <li key={id}>
      {name} - PHP{price.sellPrice} x{quantity}
      <button onClick={() => handleDecrement(id, quantity)}>-</button>
      <button onClick={() => handleIncrement(id, quantity)}>+</button>
    </li>
  );
}

function ProductList() {
  const { products } = useProducts();
  if (!products.length) return <div>No product listed.</div>;
  return (
    <div>
      <ul>
        {products.map((product) => (
          <Product
            key={product.id}
            {...product}
          />
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
      <ProductList/>
  );
}

export default App;
