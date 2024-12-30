import React, { useEffect, useState } from "react";
import Navbar from "../../navbar/Navbar";
import { Link } from "react-router-dom";

function History() {
  const [sentOrders, setSentOrders] = useState([]);
  const [selectedType, setSelectedType] = useState("cash");

  const [cash, setCash] = useState([]);
  const [card, setCard] = useState([]);
  const [mb, setMb] = useState([]);
  const [due, setDue] = useState([]);
  const printId = (e) => {
    console.log(e.target.id);
    if (e.target.id === "cash") {
      setSelectedType("cash");
      console.log(cash);

    }
    if (e.target.id === "card") {
      setSelectedType("card");
    }
    if (e.target.id === "mb") {
      setSelectedType("mobile");
    }
    if (e.target.id === "due") {
      setSelectedType("due");
    }
  };

  useEffect(() => {
    let orders = JSON.parse(localStorage.getItem(`orderHistory`)) || [];
    // orders = orders.slice().reverse()

    setSentOrders(orders);
    const billsByType = orders.reduce((acc, item) => {
      const { bill } = item;
      if (!acc[bill]) {
        acc[bill] = [];
      }
      acc[bill].push(item);
      return acc;
    }, {});
    if (billsByType.cash) {
      setCash(billsByType.cash);
    }
    if (billsByType.card) {
      setCard(billsByType.card);
    }

    if (billsByType.mobile) {
      setMb(billsByType.mobile);
    }
    if (billsByType.due) {
      setDue(billsByType.due);
    }
  }, []); // Add empty dependency array to prevent infinite updates

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">

            <Link
              to="/dashboard/history"
              className="border-b-2 border-indigo-500 py-4 px-1"
            >
              <span className="text-sm font-medium text-indigo-600">
                Order History
              </span>
            </Link>
            <Link to="/dashboard/history_items" className="py-4 px-1">
              <span className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Items History
              </span>
            </Link>
          </div>
        </div>
      </nav>
      <div className="button-group">
        <button
          id="cash"
          onClick={printId}
          style={{
            margin: "5px",
            backgroundColor: "#2c3e50", // Dark blue-gray
            color: "#fff",
            border: "1px solid #34495e", // Slightly lighter border
            borderRadius: "5px",
            padding: "10px 20px",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#34495e")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2c3e50")}
        >
          Cash
        </button>
        <button
          id="card"
          onClick={printId}
          style={{
            margin: "5px",
            backgroundColor: "#1a252f", // Darker shade of blue
            color: "#fff",
            border: "1px solid #23303d", // Slightly lighter border
            borderRadius: "5px",
            padding: "10px 20px",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#23303d")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#1a252f")}
        >
          Card
        </button>
        <button
          id="mb"
          onClick={printId}
          style={{
            margin: "5px",
            backgroundColor: "#212121", // Dark charcoal
            color: "#fff",
            border: "1px solid #333", // Slightly lighter border
            borderRadius: "5px",
            padding: "10px 20px",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#212121")}
        >
          Mobile Banking
        </button>
        <button
          id="due"
          onClick={printId}
          style={{
            margin: "5px",
            backgroundColor: "#3e4a59", // Dark slate gray
            color: "#fff",
            border: "1px solid #4c5b6a", // Slightly lighter border
            borderRadius: "5px",
            padding: "10px 20px",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#4c5b6a")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#3e4a59")}
        >
          Due
        </button>
      </div>

      {/* Order History */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-black to-gray-900 text-4xl">
          {selectedType}
        </h1>
        <hr />
        <div className="font-sans p-6 bg-gray-100">
          <h2 className="text-3xl font-bold text-center mb-8">Orders Summary</h2>
          {sentOrders.map((order, index) => (
            <div key={index}>
              {order.bill === selectedType ? (
                <div className="mb-10 bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-[#1c1d22]">
                    Order ID: {order._id}
                  </h3>
                  <table className="w-full bg-white border-collapse">
                    <tbody>
                      <tr className="border-b">
                        <th className="p-4 bg-[#313b44] text-white text-left">Phone</th>
                        <td className="p-4">{order.phoneNumber}</td>
                      </tr>
                      <tr className="border-b">
                        <th className="p-4 bg-[#313b44] text-white text-left">Type</th>
                        <td className="p-4">{order.type}</td>
                      </tr>
                      <tr className="border-b">
                        <th className="p-4 bg-[#313b44] text-white text-left">Table</th>
                        <td className="p-4">{order.table}</td>
                      </tr>
                      <tr className="border-b">
                        <th className="p-4 bg-[#313b44] text-white text-left">Payment</th>
                        <td className="p-4">{order.bill}</td>
                      </tr>
                      <tr className="border-b">
                        <th className="p-4 bg-[#313b44] text-white text-left">Discount</th>
                        <td className="p-4 text-red-600 font-bold">
                          {order.discount ? `${order.discount}%` : "No Discount"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <th className="p-4 bg-[#313b44] text-white text-left">Total</th>
                        <td className="p-4 text-[#1c1d22] font-bold">{order.price} TK (with 5% VAT added)</td>
                      </tr>
                      <tr>
                        <th className="p-4 bg-[#313b44] text-white text-left">Date</th>
                        <td className="p-4">{order.date_time}</td>
                      </tr>
                    </tbody>
                  </table>

                  {order.orders.length > 0 && (
                    <>
                      <h4 className="text-xl font-bold mt-6 mb-4">Order Items</h4>
                      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-[#313b44] text-white">
                            <th className="p-4 text-left">Image</th>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Bio</th>
                            <th className="p-4 text-left">Price</th>
                            <th className="p-4 text-left">Size</th>
                            <th className="p-4 text-left">Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.orders.map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-4">
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-24 h-auto rounded-md"
                                />
                              </td>
                              <td className="p-4">{item.name}</td>
                              <td className="p-4">{item.bio}</td>
                              <td className="p-4">{item.price}</td>
                              <td className="p-4">{item.selectedSize}</td>
                              <td className="p-4">{item.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>



      </div>
    </div>
  );
}

export default History;
