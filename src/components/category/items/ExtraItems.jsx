import _ from "lodash";
import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function ExtraItems({ getCount, category, item }) {
  const setOrder = () => {
    const newItem = item;
    const orders = JSON.parse(localStorage.getItem(`orders`)) || [];

    newItem.edited = false;

    const index = orders.findIndex(
      (element) =>
        _.isEqual(newItem.name, element.name) &&
        _.isEqual(newItem.ingredients, element.ingredients) &&
        _.isEqual(newItem.selectedSize, element.selectedSize)
    );

    if (index !== -1) {
      orders[index].quantity += 1;
    } else {
      newItem.quantity = 1;
      orders.push(newItem);
    }

    const totalQuantity = orders.reduce(
      (acc, order) => acc + order.quantity,
      0
    );
    getCount(totalQuantity);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Show success toast
    toast.success(`${item.name} added to cart!`, {
      duration: 2000,
      position: "bottom-right",
      style: {
        background: "#4F46E5",
        color: "#ffffff",
        padding: "16px",
      },
      icon: "🛒",
    });
  };

  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
      {/* Image Container */}
      <div className="flex-shrink-0 w-16 h-16">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
        />
      </div>

      {/* Details Container */}
      <div className="flex-grow mx-4">
        <h3 className="text-lg font-bold line-clamp-1">{item.name}</h3>
        <h4 className="text-sm opacity-80 line-clamp-1">{item.size[0]?.size}</h4>
        <div className="flex items-baseline">
          <span className="text-sm font-medium opacity-80 mr-1">৳</span>
          <span className="text-xl font-bold">{item.price}</span>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={(e) => {
          e.preventDefault(); // Prevent link navigation
          setOrder();
        }}
        className="ml-4 rounded-lg bg-blue-600 text-white py-2 px-4 text-sm font-medium transition-all duration-300 hover:bg-blue-700 active:scale-95"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ExtraItems;
