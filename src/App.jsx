import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import viteLogo from "/vite.svg";
import "./App.css";
import Category from "./components/category/Category";
import Home from "./components/home/Home";
import Items from "./components/category/items/Items";
import SingleItem from "./components/category/items/singleItem/SingleItem";
import Cart from "./components/cart/Cart";
import History from "./components/category/history/History";
import { Toaster } from "react-hot-toast";
import MenuSearch from "./components/menuSearch/MenuSearch";
import Payment_Success from "./components/paymentMsg/Payment_Success";
import PaymentFail from "./components/paymentMsg/PaymentFail";
import POS from "./components/exm/POS";
function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Cart />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/history" element={<History />} />
        <Route path="/pos" element={<POS />} />

        <Route path="/:category" element={<Category />} />
        <Route path="/:category/:singleItem" element={<SingleItem />} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
