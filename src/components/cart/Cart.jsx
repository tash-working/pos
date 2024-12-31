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
  const [discount, setDiscount] = useState(0);
  const [grossTotal, setGrossTotal] = useState(0);
  const [menu, setMenu] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    type: "",
    table: "",
    bill: "",
    discount: "",
  });
  const [showModal, setShowModal] = useState(false);
  // Options for table numbers based on type
  const tableOptions = {
    front: Array.from({ length: 10 }, (_, i) => `front${i + 1}`),
    back: Array.from({ length: 8 }, (_, i) => `back${i + 1}`),
    smoke: Array.from({ length: 5 }, (_, i) => `smoke${i + 1}`),
  };

  // Handle input changes in the form
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Assuming netTotal is defined somewhere in your code
    const netTotal = 1000; // Replace with actual netTotal value

    // If the discount field is being changed
    if (name === "discount") {
      console.log(value);
      setDiscount(value);

      // Ensure netTotal is available before using it
      const discountAmount = Math.round(netTotal * (value / 100));
      const grossTotal =
        netTotal + Math.round(netTotal * 0.05) - discountAmount;
      setGrossTotal(grossTotal);
    }

    // If the value is "table", set table to "front1"
    if (name === "type" && value === "table") {
      setFormData({
        ...formData,
        [name]: value,
        table: "front1", // Set table to "front1" if type is "table"
      });
    } else if (name === "type" && value !== "table") {
      // If the type is not "table", set table to "0"
      setFormData({
        ...formData,
        [name]: value,
        table: "0",
      });
    } else {
      // For other fields, just update the form data
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    console.log(name); // For debugging purposes, can be removed later
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
    if (
      !formData.phoneNumber ||
      !formData.type ||
      !formData.table ||
      !formData.bill ||
      !formData.discount ||
      orders.length <= 0
    ) {
      alert(
        "Please fill in all the required fields before submitting the order."
      );
      return; // Stop the function from proceeding if any field is empty
    }
    setShowModal(true);
  };

  const confirmOrder = () => {
    const date_time = handleClick(); // Generate timestamp
    const orderData = {
      orders,
      phoneNumber: formData.phoneNumber,
      type: formData.type,
      discount: formData.discount,
      table: formData.table,
      bill: formData.bill,
      price:
        netTotal +
        Math.round(netTotal * 0.05) -
        Math.round(netTotal * (discount / 100)),
      date_time,
    };
    console.log(orderData); // Log order data for debugging
  
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Summary</title>
          <style>
            @media print {
              body {
                margin: 0;
                padding: 0;
                height: auto;
                overflow: hidden;
              }
              .order-summary {
                margin: 0;
                padding: 0;
                max-width: 100%;
                page-break-after: avoid;
                display: block;
              }
              hr {
                margin: 5px 0;
              }
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              height: auto;
              background-color: white;
            }
            .order-summary {
              width: 100%;
              max-width: 500px;
              margin: 0 auto;
              background-color: white;
              padding: 10px;
              border-radius: 6px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .order-summary h2 {
              text-align: center;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
            }
            .items-table th, .items-table td {
              border: 1px solid #ddd;
              padding: 5px;
            }
          </style>
        </head>
        <body>
          <div class="order-summary">
            <h2>VELVET BITES</h2>
            <h5>House NO-52, Road-1, Sector-3, Uttara, Dhaka-1230</h5>
            <h5>+880 1334-738387</h5>
            <h3>Guest Bill, Table No: ${formData.table}</h3>
            <h4>Order Type: ${formData.type}</h4>
            <h4>Bill Type: ${formData.bill}</h4>
            <h4>Guest phone: ${formData.phoneNumber}</h4>
            <h4>Order Time: ${date_time}</h4>
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
                ${orders
                  .map(
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
            <p>Net Total: ${netTotal}৳</p>
            <p>VAT (5%): ${(netTotal * 0.05).toFixed(2)}৳</p>
            <p>Discount: ${discount}% - ${(netTotal * (discount / 100)).toFixed(2)}৳</p>
            <p>Gross Total: ${
              (netTotal + Math.round(netTotal * 0.05)).toFixed(2) -
              Math.round(netTotal * (discount / 100))
            }৳ (Paid)</p>
            <hr />
            <p>MIDENUS POS</p>
            <p>www.midenus.com</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  
    printWindow.onload = function () {
      printWindow.print();
      printWindow.close();
    };
  
    // Reset orders and form data
    const updatedOrders = [];
    setOrders(updatedOrders);
    setCount(0);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    toast.success("Order placed successfully!", { duration: 3000, position: "top-center" });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
    setFormData({
      phoneNumber: "",
      type: "",
      table: "",
      bill: "",
      discount: "",
    });
    setDiscount(0);
  
    // Send order data to the server
    fetch("https://server-08ld.onrender.com/PosOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.location.replace(data.url);
      })
      .catch((error) => console.error("Error fetching data:", error));
  
    setShowModal(false);
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
                  <p className="font-bold text-lg text-indigo-600">
                    {netTotal}৳
                  </p>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between items-center">
                  <p className="text-gray-700">VAT - 5.00%:</p>
                  <p className="text-gray-600">
                    {(netTotal * 0.05).toFixed(2)}৳
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-700">Auto Round:</p>
                  <p className="text-gray-600">
                    {Math.round(netTotal * 0.05)}৳
                  </p>
                </div>
                <hr className="border-gray-300" />
                <hr className="border-gray-300" />
                <div className="flex justify-between items-center">
                  <p className="text-gray-700">Discount -</p>
                  <p className="text-gray-600">
                    {discount}%- {netTotal * (discount / 100)}৳
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-700">Auto Round:</p>
                  <p className="text-gray-600">
                    {Math.round(netTotal * (discount / 100))}৳
                  </p>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between items-center font-bold">
                  <p className="text-gray-700">Gross Total:</p>
                  <p className="text-lg text-[#1c1d22]">
                    {netTotal +
                      Math.round(netTotal * 0.05) -
                      Math.round(netTotal * (discount / 100))}
                    ৳
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Extras section */}
          <div className="mx-auto px-4 sm:px-6 lg:px-8 mt-8 max-h-[500px] overflow-auto">
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
                <p>Loading Items...</p>
              )}
            </div>
          </div>
        </div>
        {/* Order information form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 max-w-3xl rounded-xl bg-white p-8 shadow-lg mb-8"
        >
          <div className="grid gap-8 md:grid-cols-2">
            {[
              "phoneNumber", // Phone number input field
              "type", // Order type input field
              "table", // Table number input field
              "discount", // Discount input field
              "bill", // Bill payment type input field
            ].map((field) => (
              <div key={field} className="relative">
                <label
                  htmlFor={field}
                  className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-600"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>

                {field === "type" ? (
                  <select
                    name={field}
                    id={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring focus:ring-indigo-200 focus:outline-none"
                  >
                    <option value="">Select an opton</option>
                    <option value="table">Table</option>
                    <option value="takeAway">Take Away</option>
                    <option value="online">Online</option>
                  </select>
                ) : field === "table" && formData.type === "table" ? (
                  <select
                    name={field}
                    id={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring focus:ring-indigo-200 focus:outline-none"
                  >
                    <optgroup label="Front">
                      <option value="front1">Front 1</option>
                      <option value="front2">Front 2</option>
                      <option value="front3">Front 3</option>
                    </optgroup>
                    <optgroup label="Back">
                      <option value="back1">Back 1</option>
                      <option value="back2">Back 2</option>
                      <option value="back3">Back 3</option>
                    </optgroup>
                    <optgroup label="Smoke">
                      <option value="smoke1">Smoke 1</option>
                      <option value="smoke2">Smoke 2</option>
                      <option value="smoke3">Smoke 3</option>
                    </optgroup>
                  </select>
                ) : field === "bill" ? (
                  <select
                    name={field}
                    id={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring focus:ring-indigo-200 focus:outline-none"
                  >
                    <option value="">Select an opton</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="mobile">Mobile</option>
                    <option value="due">Due</option>
                  </select>
                ) : (
                  <input
                    type={field === "phoneNumber" ? "tel" : "text"} // Conditional input type
                    name={field}
                    id={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring focus:ring-indigo-200 focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-[#313b44] text-white py-2 px-4 rounded-lg hover:bg-[#313b50] hover:shadow-indigo-600/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95 transition-all duration-200"
          >
            Place Order
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setShowModal(false)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">Confirm Order</h2>
            <p className="mb-4">Are you sure you want to place this order?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                onClick={confirmOrder}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
