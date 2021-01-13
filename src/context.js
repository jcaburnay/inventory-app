import React, { useState, useEffect, useContext, createContext } from 'react';
import { v4 } from 'uuid';

let initialInventories = [
  {
    id: v4(),
    name: 'Gadgets',
    description: 'Room storage for devices/gadgets',
    products: [
      {
        id: v4(),
        name: 'Mechanical Keyboard TKL',
        price: {
          purchasePrice: 2550,
          sellPrice: 2950
        },
        quantity: 4,
        category: 'Computer Accessories'
      },
      {
        id: v4(),
        name: 'Mouse',
        price: {
          purchasePrice: 879,
          sellPrice: 999
        },
        quantity: 7,
        category: 'Computer Accessories'
      },
    ]
  },
  {
    id: v4(),
    name: 'Food Storage',
    description: 'Storage for foods',
    products: [
      {
        id: v4(),
        name: 'Milo',
        price: {
          purchasePrice: 89,
          sellPrice: 109
        },
        quantity: 24,
        category: 'Drinks'
      },
      {
        id: v4(),
        name: 'Bear Brand',
        price: {
          purchasePrice: 76,
          sellPrice: 89
        },
        quantity: 36,
        category: 'Drinks'
      },
      {
        id: v4(),
        name: 'Ladys Choice',
        price: {
          purchasePrice: 99,
          sellPrice: 129
        },
        quantity: 3,
        category: 'Spread'
      },
      {
        id: v4(),
        name: '555 Fried Sardines',
        price: {
          purchasePrice: 22,
          sellPrice: 34
        },
        quantity: 12,
        category: 'Canned goods'
      },
    ]
  }
];

const ProductContext = createContext();
const useProducts = () => useContext(ProductContext);

function ProductProvider({ children }) {
  const localInventory = localStorage.getItem('inventories');
  const [inventories, setInventories] = useState(!localInventory ? JSON.parse(localInventory) : initialInventories);
  const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   localStorage.setItem('products', JSON.stringify(products))
  // }, [products]);

  useEffect(() => {
    localStorage.setItem('inventories', JSON.stringify(inventories))
  }, [inventories]);

  const addInventory = (name, description) => {
    setInventories([
      ...inventories,
      {
        "id": v4(),
        "name": name,
        "description": description,
        "products": []
      }
    ])
  };

  const handleInventoryItems = id => {
    if(!initialInventories.filter(inventory => inventory.id === id).length) {
      setProducts([]);
    } else {
      let products = initialInventories.filter(inventory => inventory.id === id)[0].products.map(product => product);
      setProducts(products);
    }
  };

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

  const addItem = (name, purchasePrice, sellPrice, quantity, category) => {
    setProducts([
      ...products,
      {
        "id": v4(),
        "name": name,
        "price": { 
          "purchasePrice": purchasePrice,
          "sellPrice": sellPrice
        },
        "quantity": quantity,
        "category": category
      }
    ]);
  };

  const handleRemove = id => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <ProductContext.Provider value={{ addInventory, handleInventoryItems, inventories, products, setProducts, handleIncrement, handleDecrement, addItem, handleRemove }}>
      { children }
    </ProductContext.Provider>
  );
}

export { useProducts, ProductProvider }