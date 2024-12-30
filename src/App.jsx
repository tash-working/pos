import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Category from "./components/category/Category";

import SingleItem from "./components/category/items/singleItem/SingleItem";
import Cart from "./components/cart/Cart";
import History from "./components/category/history/History";
import { Toaster } from "react-hot-toast";

import Dashboard from "./components/exm/Dashboard";
import ItemsHistory from "./components/category/history/ItemsHistory";
function App() {


  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Cart />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/dashboard/history" element={<History />} />
        <Route path="/dashboard/history_items" element={<ItemsHistory />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/:category" element={<Category />} />
        <Route path="/:category/:singleItem" element={<SingleItem />} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
