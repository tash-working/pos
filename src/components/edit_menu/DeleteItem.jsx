import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";

const DeleteItem = () => {
  const [menu, setMenu] = useState([]);
  const [extras, setExtras] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sentOrders, setSentOrders] = useState([]);
  const [netTotal, setNetTotal] = useState(0);
  const [grossTotal, setGrossTotal] = useState(0);
  const [count, setCount] = useState(0);

  const getItems = async () => {
    const id = JSON.parse(localStorage.getItem("id"));
    try {
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      if (menu.length === 0) {
        const response = await fetch(
          `https://server-08ld.onrender.com/getMenu/${id}`
        );
        const jsonData = await response.json();
        setMenu(jsonData[0].menu);
        localStorage.setItem("menu", JSON.stringify(jsonData[0].menu));

        // Extract all items for extras
        const allItems = jsonData[0].menu.flatMap(
          (category) => category.items || []
        );
        setExtras(allItems);
      }

      // Calculate totals and update state
      const totalQuantity = orders.reduce(
        (acc, order) => acc + order.quantity,
        0
      );
      const subtotal = orders.reduce(
        (acc, order) => acc + order.price * order.quantity,
        0
      );
      setNetTotal(subtotal);
      setGrossTotal(subtotal + Math.round(subtotal * 0.05));
      setOrders(orders);
      setCount(totalQuantity);

      // Retrieve sent orders from localStorage
      const sentOrders = JSON.parse(localStorage.getItem("sentOrders")) || [];
      setSentOrders(sentOrders);
    } catch (error) {
      console.error(error); // Log errors for debugging
    }
  };

  const handleDeleteItem = async (itemName) => {
    const id = JSON.parse(localStorage.getItem("id"));
    try {
      // Send a request to the backend to delete the item
      const response = await fetch(
        `https://server-08ld.onrender.com/delete_item/${id}/${itemName}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // After deletion, remove the item from the menu state directly
        setMenu((prevMenu) => {
          return prevMenu.map((category) => {
            return {
              ...category,
              items: category.items.filter((item) => item.name !== itemName),
            };
          });
        });
        alert("Item deleted successfully!");
      } else {
        alert("Failed to delete item. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again later.");
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Delete Menu Items</h1>
        <div className="space-y-8">
          {menu.map((category) => (
            <div
              key={category.category}
              className="border p-4 rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4">
                {category.category}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between border-b py-2"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-full mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.size
                            .map((s) => `${s.size}: ${s.price}`)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.name)}
                      className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeleteItem;
