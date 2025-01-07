import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Navbar from "../navbar/Navbar";
import { Link } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  FaMoneyBill,
  FaMobileAlt,
  FaMoneyCheck,
  FaExclamationCircle,
  FaArrowRight,
} from "react-icons/fa";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [cash, setCash] = useState([]);
  const [card, setCard] = useState([]);
  const [mb, setMb] = useState([]);
  const [due, setDue] = useState([]);
  const [id, setId] = useState("");

  const fetchPOSOrders = async () => {
    const id = JSON.parse(localStorage.getItem("id"));
    setId(id);

    try {
      const response = await fetch(
        `https://server-08ld.onrender.com/posOrder/${id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const posOrders = await response.json();
      setOrders(posOrders);

      function generateSalesReportByDate(data) {
        const salesByDate = {};

        data.forEach((order) => {
          const orderDate = new Date(order.date_time).toLocaleDateString();

          if (!salesByDate[orderDate]) {
            salesByDate[orderDate] = {
              totalSales: 0,
              orders: [],
            };
          }

          salesByDate[orderDate].totalSales += order.price;
          salesByDate[orderDate].orders.push(order);
        });

        const salesReportArray = Object.entries(salesByDate).map(
          ([date, salesData]) => ({
            date,
            ...salesData,
          })
        );
        console.log(salesReportArray);
      }
      generateSalesReportByDate(posOrders);

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
    // Returns null if no user or parsing fails
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
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link to={`/${id}/dashboard`} className="py-4 px-1">
              <span className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Didn't figure out
              </span>
            </Link>
            <Link to={`/${id}/dashboard`} className="py-4 px-1">
              <span className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Didn't figure out
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="my-8">
        <h2 className="text-2xl font-bold text-center mb-4">
          Payment Breakdown Chart
        </h2>
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
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
            >
              <FaMoneyBill size={20} /> Cash
            </div>
            <hr />
            <p>Total Orders: {cash.length}</p>
            <p>Amount: {cash.reduce((sum, item) => sum + item.price, 0)} TK</p>
            <p>
              Percentage:{" "}
              {(
                (cash.reduce((sum, item) => sum + item.price, 0) /
                  orders.reduce((sum, item) => sum + item.price, 0)) *
                100
              ).toFixed(2)}
              %
            </p>
          </div>
          <div
            id="mobileBanking"
            className="px-6 py-3 bg-[#023020] text-white text-center cursor-pointer rounded hover:bg-[#717786]"
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
            >
              <FaMobileAlt />
              <FaMoneyCheck />
              Mobile Banking
            </div>
            <hr />
            <p>Total Orders: {mb.length}</p>
            <p>Amount: {mb.reduce((sum, item) => sum + item.price, 0)} TK</p>
            <p>
              Percentage:{" "}
              {(
                (mb.reduce((sum, item) => sum + item.price, 0) /
                  orders.reduce((sum, item) => sum + item.price, 0)) *
                100
              ).toFixed(2)}
              %
            </p>
          </div>
          <div
            id="card"
            className="px-6 py-3 bg-[#301934] text-white text-center cursor-pointer rounded hover:bg-[#717786]"
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
            >
              <FaMoneyCheck /> Card
            </div>
            <hr />
            <p>Total Orders: {card.length}</p>
            <p>Amount: {card.reduce((sum, item) => sum + item.price, 0)} TK</p>
            <p>
              Percentage:{" "}
              {(
                (card.reduce((sum, item) => sum + item.price, 0) /
                  orders.reduce((sum, item) => sum + item.price, 0)) *
                100
              ).toFixed(2)}
              %
            </p>
          </div>
          <div
            id="due"
            className="px-6 py-3 bg-[#343434] text-white text-center cursor-pointer rounded hover:bg-[#717786]"
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
            >
              <FaExclamationCircle /> Due
            </div>
            <hr />
            <p>Total Orders: {due.length}</p>
            <p>Amount: {due.reduce((sum, item) => sum + item.price, 0)} TK</p>
            <p>
              Percentage:{" "}
              {(
                (due.reduce((sum, item) => sum + item.price, 0) /
                  orders.reduce((sum, item) => sum + item.price, 0)) *
                100
              ).toFixed(2)}
              %
            </p>
          </div>
          <Link to={`/${id}/dashboard/history`}>
            <button
              style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
              id="btn"
              className="px-6 py-3 bg-[#343434] text-white text-center cursor-pointer rounded hover:bg-[#717786]"
            >
              See Order History <FaArrowRight />
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
