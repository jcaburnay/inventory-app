import React from "react";
import { useProducts } from './context';
import { useInput } from './custom-hooks';
import "./App.css";

//Inventory Components

function AddInventory() {
  const { addInventory } = useProducts();
  const [inventory, setInventory] = useInput("");
  const [description, setDescription] = useInput("");

  const submit = e => {
    e.preventDefault();
    addInventory(inventory.value, description.value);
    setDescription();
    setInventory();
  }

  return (
    <>
      <form onSubmit={submit}>
        <label>
          Inventory name:
          <input {...inventory} type="text" placeholder="inventory name" required/>
        </label>
        <br />
        <label>
          Description:
          <input {...description} type="text" placeholder="description" required/>
        </label>
        <br />
        <button>Add inventory</button>
      </form>
      <br />
    </>
  )
}

function InventoryList() {
  const { inventories, handleInventoryItems } = useProducts();
  return (
    <>
      <div>
        {inventories.length === 0 ? <div>No inventory listed.</div> : inventories.map(inventory => <button key={inventory.id} onClick={() => handleInventoryItems(inventory.id)}>{inventory.name}</button>)}
      </div>
      <hr />
    </>
  )
}

function AddItem() {
  const { addItem } = useProducts();
  const [name, setName] = useInput("");
  const [purchasePrice, setPurchasePrice] = useInput("");
  const [sellPrice, setSellPrice] = useInput("");
  const [quantity, setQuantity] = useInput("");
  const [category, setCategory] = useInput("");

  const resetInput = () => {
    setName();
    setPurchasePrice();
    setSellPrice();
    setQuantity();
    setCategory();
  };

  const submit = e => {
    e.preventDefault();
    addItem(name.value, Number(purchasePrice.value), Number(sellPrice.value), Number(quantity.value), category.value);
    resetInput();
  };

  return (
    <>
      <form onSubmit={submit}>
        <label>
          Name:
          <input {...name} type="text" placeholder="product name" required />
        </label>
        <br />
        <label>
          Price (Purchase):
          <input {...purchasePrice} type="number" placeholder="purchasing price" min="0" required/>
        </label>
        <br />
        <label>
          Price (Sell):
          <input {...sellPrice} type="number" placeholder="selling price" min="0" required/>
        </label>
        <br />
        <label>
          Quantity:
          <input {...quantity} type="number" placeholder="quantity" min="1" required/>
        </label>
        <br />
        <label>
          Category:
          <input {...category} type="text" placeholder="product category" required/>
        </label>
        <br />
        <button>Add item</button>
      </form>
      <br />
    </>
    
  )
}

function Product({ id, name, price, quantity }) {
  const { handleRemove, handleDecrement, handleIncrement } = useProducts();
  return (
    <li key={id}>
      <button onClick={() => handleRemove(id)}>x</button>
      {name} - PHP{price.sellPrice} x{quantity}
      <button onClick={() => handleDecrement(id, quantity)}>-</button>
      <button onClick={() => handleIncrement(id, quantity)}>+</button>
    </li>
  );
}

function ProductList() {
  const { products, setProducts } = useProducts();
  const handleFilter = category => {
    if(category === 'all') {
      setProducts(products);
    } else {
      setProducts(products.filter(product => product.category === category));
    }
  };

  const categories = ['all'].concat(products.map(product => product.category).filter((category, idx, arr) => arr.indexOf(category) === idx));

  if (!products.length) return <div>No product listed.</div>;
  return (
    <div>
      <div>
        {categories.map((category, idx) => <button key={idx} onClick={() => handleFilter(category)}>{category}</button>)}
      </div>
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
      <AddInventory />
      <InventoryList />
      <AddItem />
      <ProductList />
    </>
  );
}

export default App;
