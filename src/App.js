import React from "react";
import { useApp } from "./context";
import { useInput } from "./custom-hooks";
import "./App.css";

//Inventory Components

function AddInventory() {
  const { addInventory } = useApp();
  const [inventory, setInventory] = useInput("");
  const [description, setDescription] = useInput("");

  const submit = (e) => {
    e.preventDefault();
    addInventory(inventory.value, description.value);
    setDescription();
    setInventory();
  };

  return (
    <>
      <form onSubmit={submit}>
        <label>
          Inventory name:
          <input {...inventory} type="text" required />
        </label>
        <label>
          Description:
          <input {...description} type="text" required />
        </label>
        <button>Add inventory</button>
      </form>
      <br />
    </>
  );
}

function InventoryList() {
  const { inventories, handleChangeInventory } = useApp();
  if (!inventories.length) return <div>No inventory listed.</div>;
  return (
    <>
      {inventories.map((inventory) => (
        <button
          key={inventory.id}
          onClick={() => handleChangeInventory(inventory.id)}
        >
          {inventory.name}
        </button>
      ))}
      <br />
      <hr />
    </>
  );
}

// Product components

function AddProduct() {
  const { handleAddProduct } = useApp();
  const [name, resetName] = useInput("");
  const [purchasePrice, resetPurchasePrice] = useInput("");
  const [sellPrice, resetSellPrice] = useInput("");
  const [quantity, resetQuantity] = useInput("");
  const [category, resetCategory] = useInput("");

  const resetInput = () => {
    resetName();
    resetPurchasePrice();
    resetSellPrice();
    resetQuantity();
    resetCategory();
  };

  const submit = (e) => {
    e.preventDefault();
    handleAddProduct(
      name.value,
      Number(purchasePrice.value),
      Number(sellPrice.value),
      Number(quantity.value),
      category.value
    );
    resetInput();
  };

  return (
    <>
      <form onSubmit={submit}>
        <label>
          Name:
          <input {...name} type="text" required />
        </label>
        <label>
          Price (Purchase):
          <input {...purchasePrice} type="number" min="0" required />
        </label>
        <label>
          Price (Sell):
          <input {...sellPrice} type="number" min="0" required />
        </label>
        <label>
          Quantity:
          <input {...quantity} type="number" min="1" required />
        </label>
        <label>
          Category:
          <input {...category} type="text" required />
        </label>
        <button>Add item</button>
      </form>
      <br />
    </>
  );
}

function Product({ id, name, price, quantity, visibility }) {
  const { handleRemoveProduct, handleDecrement, handleIncrement } = useApp();
  return (
    <li key={id} style={{ display: visibility }}>
      <button onClick={() => handleRemoveProduct(id)}>x</button>
      {name} - PHP{price.sellPrice} x{quantity}
      <button onClick={() => handleDecrement(id, quantity)}>-</button>
      <button onClick={() => handleIncrement(id, quantity)}>+</button>
    </li>
  );
}

function ProductList() {
  const { inventories, handleCategoryFilter } = useApp();

  const activeInventory = inventories.filter(
    (inventory) => inventory.isActive
  )[0];

  if (!activeInventory) return <div>No active inventory</div>;
  return (
    <div>
      <p>Active Inventory: {activeInventory.name}</p>
      {!activeInventory.products.length ? (
        <p>No products listed.</p>
      ) : (
        <>
          <button onClick={() => handleCategoryFilter("All")}>All</button>
          {activeInventory.products
            .map((product) => product.category)
            .filter((category, idx, arr) => arr.indexOf(category) === idx)
            .map((category, idx) => (
              <button key={idx} onClick={() => handleCategoryFilter(category)}>
                {category}
              </button>
            ))}
          <ul>
            {activeInventory.products.map((product) => (
              <Product key={product.id} {...product} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <>
      <AddInventory />
      <InventoryList />
      <AddProduct />
      <ProductList />
    </>
  );
}

export default App;
