import React, { useState } from 'react';
import './App.css';

let productData = [
  {
    id: 1,
    name: 'Rice Cooker',
    price: {
      purchasePrice: 999,
      sellPrice: 1299
    },
    quantity: 4,
    categoryId: 'Appliances',
    locations: [
      'Inventory Room 1'
    ]
  },
  {
    id: 2,
    name: 'Flour',
    price: {
      purchasePrice: 49,
      sellPrice: 67
    },
    quantity: 10,
    categoryId: 'Raw Material',
    locations: [
      'Inventory Room 2'
    ]
  },
  {
    id: 3,
    name: 'Choco Chips',
    price: {
      purchasePrice: 89,
      sellPrice: 110
    },
    quantity: 8,
    categoryId: 'Food',
    locations: [
      'Inventory Room 3'
    ]
  },
];

function Buttons({ quantity, onIncrement, onDecrement }) {
  const handleIncrement = () => {
    onIncrement(quantity + 1)
  }
  const handleDecrement = () => {
    if(quantity === 0) {
      return;
    }
    onDecrement(quantity - 1)
  };
  return (
    <>
      <button onClick={handleDecrement}>-</button><button onClick={handleIncrement}>+</button>
    </>
  )
}

function Product({ id, name, price, quantity, onIncrement, onDecrement }) {
  return (
      <li key={id}>{name} @PHP{price.sellPrice} x{quantity} <Buttons quantity={quantity} onIncrement={quantity => onIncrement(id, quantity)} onDecrement={quantity => onDecrement(id, quantity)}/></li>
  )
}

function ProductList({ products = [], onIncrementItem, onDecrementItem }) {
  if(!products.length) return <div>No product listed.</div>;
  return (
    <div>
      <ul>
        {
          products.map(product => <Product key={product.id} {...product} onIncrement={onIncrementItem} onDecrement={onDecrementItem}/>)
        }
      </ul>
    </div>
  )
}

function App() {
  const [products, setProducts] = useState(productData);
  const handleQuantityChange = (id, quantity) => {
    const newSet = products.map(prod => 
      prod.id === id ? { ...prod, quantity } : prod
    );
    setProducts(newSet);
  }
  return (
    <div>
      <ProductList 
        products={products} 
        onIncrementItem={handleQuantityChange}
        onDecrementItem={handleQuantityChange}
      />
    </div>
  );
}

export default App;
