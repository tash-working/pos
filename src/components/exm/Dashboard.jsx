import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Navbar from "../navbar/Navbar";
import { Link } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {FaMoneyBill ,FaMobileAlt,  FaMoneyCheck,FaExclamationCircle,FaArrowRight  } from "react-icons/fa";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [cash, setCash] = useState([]);
  const [card, setCard] = useState([]);
  const [mb, setMb] = useState([]);
  const [due, setDue] = useState([]);

  const fetchPOSOrders = async () => {
    try {
      const response = await fetch("https://server-08ld.onrender.com/posOrder");
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

  const chartData = {
    labels: ["Cash", "Mobile Banking", "Card", "Due"],
    datasets: [
      {
        label: "Payment Breakdown",
        data: [
          cash.reduce((sum, item) => sum + item.price, 0),
          mb.reduce((sum, item) => sum + item.price, 0),
          card.reduce((sum, item) => sum + item.price, 0),
          due.reduce((sum, item) => sum + item.price, 0),
        ],
        backgroundColor: ["#36454F", "#023020", "#301934", "#343434"],
        borderColor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} TK`,
        },
      },
    },
  };

  return (
    <div>
      <Navbar />



      <div className="my-8">

        <h2 className="text-2xl font-bold text-center mb-4">Payment Breakdown Chart</h2>
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
           
            <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
            <FaMoneyBill size={20} />Cash
        </div>
            <hr />
            <p>Total Orders : {cash.length}</p>
            <p>Amount : {cash.reduce((sum, item) => sum + item.price, 0)} TK</p>
          </div>
          <div
            id="mobileBanking"
            className="px-6 py-3 bg-[#023020] text-white text-center cursor-pointer rounded hover:bg-[#717786]"
          >
           <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
            <FaMobileAlt/>
           <FaMoneyCheck />
            Mobile Banking
        </div>
            <hr />
            <p>Total Orders : {mb.length}</p>
            <p>Amount : {mb.reduce((sum, item) => sum + item.price, 0)} TK</p>
          </div>
          <div
            id="card"
            className="px-6 py-3 bg-[#301934] text-white text-center cursor-pointer rounded hover:bg-[#717786]"
          >
             
             <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
             <FaMoneyCheck />Card
        </div>
            <hr />
            <p>Total Orders : {card.length}</p>
            <p>Amount : {card.reduce((sum, item) => sum + item.price, 0)} TK</p>
          </div>
          <div
            id="due"
            className="px-6 py-3 bg-[#343434] text-white text-center cursor-pointer rounded hover:bg-[#717786]"
          >
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
            <FaExclamationCircle />Due
        </div>
            <hr />
            <p>Total Orders : {due.length}</p>
            <p>Amount : {due.reduce((sum, item) => sum + item.price, 0)} TK</p>
          </div>

          <Link to="/dashboard/history">
            <button style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
              id="btn"
              className="px-6 py-3 bg-[#343434] text-white text-center cursor-pointer rounded hover:bg-[#717786]"
            >
              See Order history <FaArrowRight />
            </button>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
