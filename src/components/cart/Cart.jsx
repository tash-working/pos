import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import bin from "./bin.png";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import Items from "../category/items/Items";
import ExtraItems from "../category/items/ExtraItems";

function Cart() {
  const [orders, setOrders] = useState([]);
  const [extras, setExtras] = useState({});
  const [sentOrders, setSentOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [netTotal, setNetTotal] = useState(0);
  const [grossTotal, setGrossTotal] = useState(0);

  const [menu, setMenu] = useState([]);

  const [showConfetti, setShowConfetti] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);




  const [formData, setFormData] = useState({
    phoneNumber: "",
    type: "",
    table: ""

  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [dateTime, setDateTime] = useState(null);

  const handleClick = () => {
    const now = new Date();

    // Get the date components
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Pad with leading zero if needed
    const day = now.getDate().toString().padStart(2, "0");

    // Get the time components in 24-hour format
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    // Format the date and time string
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
  };

  
  const handleSubmit = (event) => {
    event.preventDefault();
    const date_time = handleClick();
  
      const orderData = {
        orders,
        phoneNumber: formData.phoneNumber,
        type: formData.type,
        table: formData.table,
     
        price: grossTotal,
     
  
        date_time,    
      };
      console.log(orderData);
      

    


      const updatedOrders = [];
      setOrders(updatedOrders);

      const totalQuantity = updatedOrders.reduce(
        (acc, order) => acc + order.quantity,
        0
      );
      setCount(totalQuantity);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));

      // Show success toast
      toast.success("Order placed successfully!", {
        duration: 3000,
        position: "top-center",
      });

      // Show confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      // Reset form
      setFormData({
        phoneNumber: "",
        type: "",
        table: ""
      });
    
  };


  const add = (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index] = {
      ...updatedOrders[index],
      quantity: updatedOrders[index].quantity + 1,
    };
    setOrders(updatedOrders);

    const totalQuantity = updatedOrders.reduce(
      (acc, order) => acc + order.quantity,
      0
    );
    setCount(totalQuantity);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const minus = (index) => {
    const updatedOrders = [...orders];
    if (updatedOrders[index].quantity > 1) {
      updatedOrders[index] = {
        ...updatedOrders[index],
        quantity: updatedOrders[index].quantity - 1,
      };
    }
    setOrders(updatedOrders);

    const totalQuantity = updatedOrders.reduce(
      (acc, order) => acc + order.quantity,
      0
    );
    setCount(totalQuantity);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const getItems = async () => {
    try {
      const orders = JSON.parse(localStorage.getItem(`orders`)) || [];
      let menu2 = []

      if( menu.length === 0){
        console.log("just got the data");
        
        const response = await fetch(`https://server-08ld.onrender.com/getMenu`);
        const jsonData = await response.json();
        setMenu(jsonData[0].menu); // Assuming setItems is used for a different purpose
        localStorage.setItem(`menu`, JSON.stringify(jsonData[0].menu));
         menu2 = jsonData[0].menu
         const allItems = []; // Temporary array to hold all items

         for (let index = 0; index < menu2.length; index++) {
           const element = menu2[index];
           
           if (element && element.items && Array.isArray(element.items)) {
             // Safety checks
             allItems.push(...element.items); // Use spread to add all items from the category to avoid nested arrays
           }
         }
         
         setExtras(allItems);
      }else{
        //  menu2 = JSON.parse(localStorage.getItem(`menu`));
         console.log("had the data");
         
      }

     
      
    
      const totalQuantity = orders.reduce(
        (acc, order) => acc + order.quantity,
        0
      );
      function calculateSubtotal(items) {
        let subtotal = 0;

        // Loop through each item
        for (const item of items) {
          // Multiply price by quantity and add to subtotal
          subtotal += item.price * item.quantity;
        }

        return subtotal;
      }

      const subtotal = calculateSubtotal(orders);

      setNetTotal(subtotal);
      setGrossTotal(subtotal + Math.round(subtotal * 0.05));
      setOrders(orders);
      setCount(totalQuantity);

      let sentOrders = JSON.parse(localStorage.getItem(`sentOrders`)) || [];
      // sentOrders = sentOrders.slice().reverse()
      setSentOrders(sentOrders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
   

    getItems();
  }, [count]);

  const getCount = (data) => {
    setCount(data);
  };

  const deleteItem = (index) => {
    const updatedOrders = [...orders];
    updatedOrders.splice(index, 1);
    setOrders(updatedOrders);

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
          {/* Order Items Section */}
          <div className="flex-grow space-y-4">
            {orders.map((order, index) => (
              <div
                key={index}
                className="rounded-lg bg-white p-4 sm:p-6 shadow-sm border m-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                  {/* Item Info Section */}
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

                  {/* Actions Section */}
                  <div className="flex items-center justify-end sm:justify-center gap-4 mt-4 sm:mt-0">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
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

                    {/* Delete Button */}
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4  7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Section */}

          {/* 
          
          
          
          
          
          
          
          */}

          <>
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
             {/* Extra Items Section */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1">
           
            {extras.length >= 0 ? (
              extras.map((item) => (
                <ExtraItems
                  getCount={getCount}
                  key={item.urlName}
                  item={item}
                  category={item.category}
                />
              ))
            ) : (
              // Display a message or placeholder if extras is not available
              <p>Loading extras...</p>
            )}
          </div>
        </div>
          </>
        </div>

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
            {["phoneNumber","type", "table"].map((field) => (
              <div key={field} className="relative">
                <label
                  htmlFor={field}
                  className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-gray-600"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "phoneNumber" ? "tel" : "text"}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-white p-4 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder={`Enter your ${field.toLowerCase()}`}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-lg bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-md transition-all duration- 200 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>

       

       
      </div>
      
      
    </div>
  );
}

export default Cart;
