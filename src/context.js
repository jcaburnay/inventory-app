import React, { useState, useEffect, useContext, createContext } from "react";
import { v4 } from "uuid";

// let initialInventories = [
//   {
//     id: v4(),
//     name: 'Gadgets',
//     description: 'Room storage for devices/gadgets',
//     isActive: false,
//     products: [
//       {
//         id: v4(),
//         name: 'Mechanical Keyboard TKL',
//         price: {
//           purchasePrice: 2550,
//           sellPrice: 2950
//         },
//         quantity: 4,
//         category: 'Computer Accessories'
//       },
//       {
//         id: v4(),
//         name: 'Mouse',
//         price: {
//           purchasePrice: 879,
//           sellPrice: 999
//         },
//         quantity: 7,
//         category: 'Computer Accessories'
//       },
//     ]
//   },
//   {
//     id: v4(),
//     name: 'Food Storage',
//     description: 'Storage for foods',
//     isActive: false,
//     products: [
//       {
//         id: v4(),
//         name: 'Milo',
//         price: {
//           purchasePrice: 89,
//           sellPrice: 109
//         },
//         quantity: 24,
//         category: 'Drinks'
//       },
//       {
//         id: v4(),
//         name: 'Bear Brand',
//         price: {
//           purchasePrice: 76,
//           sellPrice: 89
//         },
//         quantity: 36,
//         category: 'Drinks'
//       },
//       {
//         id: v4(),
//         name: 'Ladys Choice',
//         price: {
//           purchasePrice: 99,
//           sellPrice: 129
//         },
//         quantity: 3,
//         category: 'Spread'
//       },
//       {
//         id: v4(),
//         name: '555 Fried Sardines',
//         price: {
//           purchasePrice: 22,
//           sellPrice: 34
//         },
//         quantity: 12,
//         category: 'Canned goods'
//       },
//     ]
//   }
// ];

const AppContext = createContext();
const useApp = () => useContext(AppContext);

function AppProvider({ children }) {
  const localDataInventory = localStorage.getItem("inventories");
  const [inventories, setInventories] = useState(
    localDataInventory ? JSON.parse(localDataInventory) : []
  );

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
    const changeActiveInventory = inventories
      .map((inventory) => {
        if (inventory.id === inventoryId) {
          const setActive = {
            ...inventory,
            isActive: true,
          };
          return setActive;
        }
        return inventory;
      })
      .map((inventory) => {
        if (inventory.id !== inventoryId) {
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
    const addNewProduct = inventories.map((inventory) => {
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
            },
          ],
        };
        return modifiedInventory;
      }
      return inventory;
    });
    setInventories(addNewProduct);
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
    // const filteredInventories = inventories.map((inventory) => {
    //   if (inventory.isActive) {
    //     const filteredProducts = {
    //       ...inventory,
    //       products: inventory.products.filter(
    //         (product) => product.category === category
    //       ),
    //     };
    //     return filteredProducts;
    //   }
    //   return inventory;
    // });
    // setInventories(filteredInventories);
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
