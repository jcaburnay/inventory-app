import React from "react";
import { useProducts } from './context';
import { useInput } from './custom-hooks';
import "./App.css";

function AddItem() {
  const { addItem } = useProducts();
  const [name, setName] = useInput("");
  const [purchasePrice, setPurchasePrice] = useInput("");
  const [sellPrice, setSellPrice] = useInput("");
  const [quantity, setQuantity] = useInput("");
  const [category, setCategory] = useInput("");
  const [locations, setLocations] = useInput(""); 
  const submit = e => {
    e.preventDefault();
    addItem(name.value, Number(purchasePrice.value), Number(sellPrice.value), Number(quantity.value), category.value, locations.value);
    setName();
    setPurchasePrice();
    setSellPrice();
    setQuantity();
    setCategory();
    setLocations();
  }
  return (
    <form onSubmit={submit}>
      <input {...name} type="text" placeholder="Name" required />
      <input {...purchasePrice} type="number" placeholder="Purchase Price" min="0" required/>
      <input {...sellPrice} type="number" placeholder="Sell Price" min="0" required/>
      <input {...quantity} type="number" placeholder="Quantity" min="1" required/>
      <input {...category} type="text" placeholder="Category" required/>
      <input {...locations} type="text" placeholder="Location" required/>
      <button>Add item</button>
    </form>
  )
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
        {products.map(product => (
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
    <>
      <AddItem />
      <ProductList />
    </>
  );
}

export default App;
