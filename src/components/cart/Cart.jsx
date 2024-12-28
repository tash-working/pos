import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import toast from "react-hot-toast";
import Confetti from "react-confetti";
import ExtraItems from "../category/items/ExtraItems";

function Cart() {
  // State variables for managing orders, extras, totals, and other UI data
  const [orders, setOrders] = useState([]);
  const [extras, setExtras] = useState({});
  const [sentOrders, setSentOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [netTotal, setNetTotal] = useState(0);
  const [grossTotal, setGrossTotal] = useState(0);
  const [menu, setMenu] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    type: "",
    table: "",
  });

  // Handle input changes in the form
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Generate a timestamp string for the current date and time
  const handleClick = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Handle form submission to place an order
  const handleSubmit = (event) => {
    event.preventDefault();
    const date_time = handleClick(); // Generate timestamp
    const orderData = {
      orders,
      phoneNumber: formData.phoneNumber,
      type: formData.type,
      table: formData.table,
      price: grossTotal,
      date_time,
    };
    console.log(orderData); // Log order data for debugging


    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Summary</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              height: auto;
              background-color: #f4f4f4;
            }
            .order-summary {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              page-break-before: always;
            }
            .order-summary h2 {
              text-align: center;
              font-size: 1.5rem;
              margin-bottom: 20px;
            }
            .order-summary .flex {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .order-summary .font-bold {
              font-weight: bold;
            }
            .order-summary hr {
              border: 1px solid #ddd;
              margin: 20px 0;
            }
            .order-summary p {
              margin: 0;
            }
            .order-summary .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .order-summary .items-table th,
            .order-summary .items-table td {
              padding: 8px;
              border: 1px solid #ddd;
              text-align: left;
            }
            .order-summary .items-table th {
              background-color: #f0f0f0;
            }
            @media print {
              body {
                height: auto;
                background-color: white;
                margin: 0;
                padding: 0;
              }
              .order-summary {
                max-width: 100%;
                page-break-after: always;
              }
            }
          </style>
        </head>
        <body>
          <div class="order-summary">
            <h2>VELVET BITES</h2>
            <h5>House NO-52, Road-1, Sector-3, Uttara, Dhaka-1230</h5>
            <h5>+880 1334-738387</h5>
            <h3>Guest Bill, Table No: ${formData.table}</h3>
            <h4>Bill Type: ${formData.type}</h4>
            <h4>Guest phone: ${formData.phoneNumber}</h4>
            <h4>Order Time: ${date_time}</h4>

            <!-- Ordered Items Table -->
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${orders.map(
                    (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price}৳</td>
                    <td>${(item.quantity * item.price).toFixed(2)}৳</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>

            <hr />
            <div class="flex">
              <p>Net Total:</p>
              <p class="font-bold text-indigo-600">${netTotal}৳</p>
            </div>
            <hr />
            <div class="flex">
              <p>VAT - 5.00%:</p>
              <p>${(netTotal * 0.05).toFixed(2)}৳</p>
            </div>
            <div class="flex">
              <p>Auto Round:</p>
              <p>${Math.round(netTotal * 0.05)}৳</p>
            </div>
            <hr />
            <div class="flex font-bold">
              <p>Gross Total:</p>
              <p>${(netTotal + Math.round(netTotal * 0.05)).toFixed(2)}৳</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    
    // Wait for the document to load and then invoke print
    printWindow.onload = function () {
      printWindow.print(); // Trigger the print dialog
      printWindow.close(); // Close the print window after printing
    };

    // Reset orders and update localStorage
    const updatedOrders = [];
    setOrders(updatedOrders);
    const totalQuantity = updatedOrders.reduce(
      (acc, order) => acc + order.quantity,
      0
    );
    setCount(totalQuantity);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // Show success toast and confetti
    toast.success("Order placed successfully!", {
      duration: 3000,
      position: "top-center",
    });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);

    // Reset form data
    setFormData({ phoneNumber: "", type: "", table: "" });
  };

  // Increment quantity of a specific order item
  const add = (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index] = {
      ...updatedOrders[index],
      quantity: updatedOrders[index].quantity + 1,
    };
    setOrders(updatedOrders);

    // Update total quantity and save to localStorage
    const totalQuantity = updatedOrders.reduce(
      (acc, order) => acc + order.quantity,
      0
    );
    setCount(totalQuantity);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  // Decrement quantity of a specific order item
  const minus = (index) => {
    const updatedOrders = [...orders];
    if (updatedOrders[index].quantity > 1) {
      updatedOrders[index] = {
        ...updatedOrders[index],
        quantity: updatedOrders[index].quantity - 1,
      };
    }
    setOrders(updatedOrders);

    // Update total quantity and save to localStorage
    const totalQuantity = updatedOrders.reduce(
      (acc, order) => acc + order.quantity,
      0
    );
    setCount(totalQuantity);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  // Fetch menu and order data from localStorage or API
  const getItems = async () => {
    try {
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      if (menu.length === 0) {
        const response = await fetch(
          "https://server-08ld.onrender.com/getMenu"
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

  // Fetch items on component mount or when count changes
  useEffect(() => {
    getItems();
  }, [count]);

  // Delete a specific item from the order list
  const deleteItem = (index) => {
    const updatedOrders = [...orders];
    updatedOrders.splice(index, 1);
    setOrders(updatedOrders);

    // Update total quantity and save to localStorage
    const totalQuantity = updatedOrders.reduce(
      (acc, order) => acc + order.quantity,
      0
    );
    setCount(totalQuantity);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      <Navbar count={count} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8">
          {/* Display order items */}
          <div className="flex-grow space-y-4">
            {orders.map((order, index) => (
              <div
                key={index}
                className="rounded-lg bg-white p-4 sm:p-6 shadow-sm border m-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                  <div className="flex gap-4 sm:gap-6">
                    <img
                      src={order.imageUrl}
                      alt={order.name}
                      className="h-20 w-20 sm:h-24 sm:w-24 rounded-md object-cover flex-shrink-0"
                    />
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 line-clamp-2">
                        {order.name}
                      </h3>
                      <span className="inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        {order.edited ? "Customized" : "Regular"}
                      </span>
                      <p className="text-base sm:text-lg font-medium text-gray-900">
                        ৳{order.price * order.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end sm:justify-center gap-4 mt-4 sm:mt-0">
                    <div className="flex items-center gap-3">
                      {/* Decrease quantity button */}
                      <button
                        onClick={() => minus(index)}
                        className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <span className="sr-only">Decrease quantity</span>
                        <svg
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                      <span className="text-gray-900 w-8 text-center">
                        {order.quantity}
                      </span>
                      {/* Increase quantity button */}
                      <button
                        onClick={() => add(index)}
                        className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <span className="sr-only">Increase quantity</span>
                        <svg
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v12m6-6H6"
                          />
                        </svg>
                      </button>
                    </div>
                    {/* Remove item button */}
                    <button
                      onClick={() => deleteItem(index)}
                      className="rounded-full bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors ml-2"
                    >
                      <span className="sr-only">Remove item</span>
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Order summary section */}
          <div>
          <div>
      <div className="flex-none max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Order Summary
        </h2>
        <div className="flex justify-between items-center">
          <p className="text-gray-700">Net Total:</p>
          <p className="font-bold text-lg text-indigo-600">{netTotal}৳</p>
        </div>
        <hr className="border-gray-300" />
        <div className="flex justify-between items-center">
          <p className="text-gray-700">VAT - 5.00%:</p>
          <p className="text-gray-600">{(netTotal * 0.05).toFixed(2)}৳</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700">Auto Round:</p>
          <p className="text-gray-600">{Math.round(netTotal * 0.05)}৳</p>
        </div>
        <hr className="border-gray-300" />
        <div className="flex justify-between items-center font-bold">
          <p className="text-gray-700">Gross Total:</p>
          <p className="text-lg text-green-600">
            {(netTotal + Math.round(netTotal * 0.05)).toFixed(2)}৳
          </p>
        </div>
      </div>
      </div>

     
    </div>
          {/* Extras section */}
          <div className="mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1">
              {extras.length >= 0 ? (
                extras.map((item) => (
                  <ExtraItems
                    getCount={setCount}
                    key={item.urlName}
                    item={item}
                    category={item.category}
                  />
                ))
              ) : (
                <p>Loading extras...</p>
              )}
            </div>
          </div>
        </div>
        {/* Order information form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 max-w-3xl rounded-xl bg-white p-8 shadow-lg mb-8"
        >
          <div className="mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Order Information
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your Order details
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {[
              "phoneNumber", // Phone number input field
              "type", // Order type input field
              "table", // Table number input field
            ].map((field) => (
              <div key={field} className="relative">
                <label
                  htmlFor={field}
                  className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-600"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "phoneNumber" ? "tel" : "text"} // Conditional input type
                  name={field}
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:ring focus:ring-indigo-200 focus:outline-none"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}

export default Cart;
