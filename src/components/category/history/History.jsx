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
            <Link to="/cart" className="py-4 px-1">
              <span className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Cart
              </span>
            </Link>
            <Link
              to="/History"
              className="border-b-2 border-indigo-500 py-4 px-1"
            >
              <span className="text-sm font-medium text-indigo-600">
                History
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
        <h1>{selectedType}</h1>
        <div className="space-y-6">
          {sentOrders
            .slice()
            .reverse()
            .map((order, index) => (
              <div>
                {order.bill === selectedType ? (
                  <div>
                    <div
                      key={index}
                      className="overflow-hidden rounded-lg bg-white shadow-sm"
                    >
                      {/* Order Header */}
                      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Order No:</p>
                            <p className="text-lg font-medium text-gray-900">
                              {order._id}
                            </p>
                          </div>
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                            {order.status}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>
                            House {order.house}, Road {order.road}, Sector{" "}
                            {order.sector}, Uttara
                          </p>
                          <p>Phone: {order.phoneNumber}</p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="divide-y divide-gray-200">
                        {order.orders.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center justify-between p-6"
                          >
                            <div className="flex items-center space-x-4">
                              <div>
                                <h4 className="text-lg font-medium text-gray-900">
                                  {item.name}
                                </h4>
                                <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                  {item.edited ? "Customized" : "Regular"}
                                </span>
                                {item.edited && (
                                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                                    <p>
                                      Size:{" "}
                                      {item.selectedSize || item.size[0].size}
                                    </p>
                                    {item.ingredients?.map(
                                      (ingredient) =>
                                        ingredient.selected && (
                                          <p
                                            key={
                                              ingredient.id || ingredient.name
                                            }
                                          >
                                            Added: {ingredient.name}
                                          </p>
                                        )
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-medium text-gray-900">
                                ৳{item.price}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div className="px-6 py-4 space-y-3">
                          <p>Net Total: {order.price}৳</p>
                          <hr></hr>
                          <p>Vat - 5.00%: {order.price * 0.05}৳</p>
                          <p>Auto Round: {Math.round(order.price * 0.05)}৳</p>
                          <hr></hr>
                          <p>
                            Gross Total:{" "}
                            {order.price + Math.round(order.price * 0.05)}৳
                          </p>
                        </div>
                      </div>
                    </div>
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
