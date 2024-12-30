import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Navbar from "../navbar/Navbar";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [cash, setCash] = useState([]);
  const [card, setCard] = useState([]);
  const [mb, setMb] = useState([]);
  const [due, setDue] = useState([]);

  const fetchPOSOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/posOrder");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const posOrders = await response.json();
      setOrders(posOrders);
      localStorage.setItem("orderHistory", JSON.stringify(posOrders));

      const billsByType = posOrders.reduce((acc, item) => {
        const { bill } = item;
        if (!acc[bill]) {
          acc[bill] = [];
        }
        acc[bill].push(item);
        return acc;
      }, {});

      console.log(billsByType);
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
    } catch (error) {
      console.error("Error fetching POS orders:", error);
    }
  };

  useEffect(() => {
    fetchPOSOrders();
  }, []);
  return (
    <div>
      <Navbar />
      <div className="my-4 text-center">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-black to-gray-900 text-4xl">
          Total Amount: {orders.reduce((sum, item) => sum + item.price, 0)} TK
        </h1>
      </div>

      <div className="my-4 flex flex-wrap gap-4 justify-center">
        <div
          id="cash"
          className="px-6 py-3 bg-[#36454F] text-white text-center cursor-pointer rounded hover:bg-[#717786]"
        >
          💵Cash
          <hr />
          <p>Total Orders : {cash.length}</p>
          <p>Amount : {cash.reduce((sum, item) => sum + item.price, 0)} TK</p>
        </div>
        <div
          id="mobileBanking"
          className="px-6 py-3 bg-[#023020] text-white text-center cursor-pointer rounded hover:bg-[#717786]"
        >
          📲Mobile Banking
          <hr />
          <p>Total Orders : {mb.length}</p>
          <p>Amount : {mb.reduce((sum, item) => sum + item.price, 0)} TK</p>
        </div>
        <div
          id="card"
          className="px-6 py-3 bg-[#301934] text-white text-center cursor-pointer rounded hover:bg-[#717786]"
        >
          💳Card
          <hr />
          <p>Total Orders : {card.length}</p>
          <p>Amount : {card.reduce((sum, item) => sum + item.price, 0)} TK</p>
        </div>
        <div
          id="due"
          className="px-6 py-3 bg-[#343434] text-white text-center cursor-pointer rounded hover:bg-[#717786]"
        >
          💸Due
          <hr />
          <p>Total Orders : {due.length}</p>
          <p>Amount : {due.reduce((sum, item) => sum + item.price, 0)} TK</p>
        </div>

        <button
          id="btn"
          className="px-6 py-3 bg-[#343434] text-white text-center cursor-pointer rounded hover:bg-[#717786]"
        >
          <Link to="/dashboard/history">See Order history ➡️</Link>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
