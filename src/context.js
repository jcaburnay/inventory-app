import React, { useState, useEffect, useContext, createContext } from "react";
import { v4 } from "uuid";

// let initialInventories = [
//   {
//     id: v4(),
//     name: "Gadgets",
//     description: "Room storage for devices/gadgets",
//     isActive: false,
//     products: [
//       {
//         id: v4(),
//         name: "Mechanical Keyboard TKL",
//         price: {
//           purchasePrice: 2550,
//           sellPrice: 2950,
//         },
//         quantity: 4,
//         category: "Computer Accessories",
//         visibility: "visible",
//       },
//       {
//         id: v4(),
//         name: "Mouse",
//         price: {
//           purchasePrice: 879,
//           sellPrice: 999,
//         },
//         quantity: 7,
//         category: "Computer Accessories",
//         visibility: "visible",
//       },
//     ],
//   },
//   {
//     id: v4(),
//     name: "Food Storage",
//     description: "Storage for foods",
//     isActive: false,
//     products: [
//       {
//         id: v4(),
//         name: "Milo",
//         price: {
//           purchasePrice: 89,
//           sellPrice: 109,
//         },
//         quantity: 24,
//         category: "Drinks",
//         visibility: "visible",
//       },
//       {
//         id: v4(),
//         name: "Bear Brand",
//         price: {
//           purchasePrice: 76,
//           sellPrice: 89,
//         },
//         quantity: 36,
//         category: "Drinks",
//         visibility: "visible",
//       },
//       {
//         id: v4(),
//         name: "Ladys Choice",
//         price: {
//           purchasePrice: 99,
//           sellPrice: 129,
//         },
//         quantity: 3,
//         category: "Spread",
//         visibility: "visible",
//       },
//       {
//         id: v4(),
//         name: "555 Fried Sardines",
//         price: {
//           purchasePrice: 22,
//           sellPrice: 34,
//         },
//         quantity: 12,
//         category: "Canned goods",
//         visibility: "visible",
//       },
//     ],
//   },
// ];

const AppContext = createContext();
const useApp = () => useContext(AppContext);

function AppProvider({ children }) {
  const localDataInventory = localStorage.getItem("inventories");
  const [inventories, setInventories] = useState(
    localDataInventory ? JSON.parse(localDataInventory) : []
  );

  // const [inventories, setInventories] = useState(initialInventories);

  useEffect(() => {
    localStorage.setItem("inventories", JSON.stringify(inventories));
  }, [inventories]);

  const addInventory = (name, description) => {
    const otherInventories = inventories.map((inventory) => {
      const setInactive = {
        ...inventory,
        isActive: false,
      };
      return setInactive;
    });
    setInventories([
      ...otherInventories,
      {
        id: v4(),
        name: name,
        description: description,
        isActive: true,
        products: [],
      },
    ]);
  };

  const handleChangeInventory = (inventoryId) => {
    const changeActiveInventory = inventories.map((inventory) => {
      if (inventory.id === inventoryId) {
        const setActive = {
          ...inventory,
          isActive: true,
        };
        return setActive;
      } else if (inventory.id !== inventoryId) {
        const setInactive = {
          ...inventory,
          isActive: false,
        };
        return setInactive;
      }
      return inventory;
    });
    setInventories(changeActiveInventory);
  };

  const handleQuantityChange = (id, quantity) => {
    const updateProductQuantity = inventories.map((inventory) => {
      if (inventory.isActive) {
        const modifiedInventory = {
          ...inventory,
          products: inventory.products.map((product) =>
            product.id === id ? { ...product, quantity } : product
          ),
        };
        return modifiedInventory;
      }
      return inventory;
    });
    setInventories(updateProductQuantity);
  };

  const handleIncrement = (id, quantity) => {
    quantity = quantity + 1;
    handleQuantityChange(id, quantity);
  };

  const handleDecrement = (id, quantity) => {
    if (quantity === 0) {
      return;
    }
    quantity = quantity - 1;
    handleQuantityChange(id, quantity);
  };

  const handleAddProduct = (
    name,
    purchasePrice,
    sellPrice,
    quantity,
    category
  ) => {
    const updateProducts = inventories.map((inventory) => {
      if (inventory.isActive) {
        const modifiedInventory = {
          ...inventory,
          products: [
            ...inventory.products,
            {
              id: v4(),
              name: name,
              price: {
                purchasePrice: purchasePrice,
                sellPrice: sellPrice,
              },
              quantity: quantity,
              category: category,
              visibility: "list-item",
            },
          ],
        };
        return modifiedInventory;
      }
      return inventory;
    });
    setInventories(updateProducts);
  };

  const handleRemoveProduct = (id) => {
    const updateProducts = inventories.map((inventory) => {
      if (inventory.isActive) {
        const modifiedInventory = {
          ...inventory,
          products: inventory.products.filter((product) => product.id !== id),
        };
        return modifiedInventory;
      }
      return inventory;
    });
    setInventories(updateProducts);
  };

  const handleCategoryFilter = (category) => {
    if (category === "All") {
      const showAllProducts = inventories.map((inventory) => {
        if (inventory.isActive) {
          const changeVisibility = {
            ...inventory,
            products: inventory.products.map((product) => {
              if (product.visibility === "none") {
                const setVisibility = {
                  ...product,
                  visibility: "list-item",
                };
                return setVisibility;
              }
              return product;
            }),
          };
          return changeVisibility;
        }
        return inventory;
      });
      setInventories(showAllProducts);
    } else {
      const filteredProducts = inventories.map((inventory) => {
        if (inventory.isActive) {
          const changeVisibility = {
            ...inventory,
            products: inventory.products.map((product) => {
              if (product.category !== category) {
                const setVisibility = {
                  ...product,
                  visibility: "none",
                };
                return setVisibility;
              } else if (product.category === category) {
                const setVisibility = {
                  ...product,
                  visibility: "list-item",
                };
                return setVisibility;
              }
              return product;
            }),
          };
          return changeVisibility;
        }
        return inventory;
      });
      setInventories(filteredProducts);
    }
  };

  return (
    <AppContext.Provider
      value={{
        addInventory,
        handleChangeInventory,
        inventories,
        handleIncrement,
        handleDecrement,
        handleAddProduct,
        handleRemoveProduct,
        handleCategoryFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { useApp, AppProvider };
