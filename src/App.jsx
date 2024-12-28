import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Category from "./components/category/Category";

import SingleItem from "./components/category/items/singleItem/SingleItem";
import Cart from "./components/cart/Cart";
import History from "./components/category/history/History";
import { Toaster } from "react-hot-toast";

import POS from "./components/exm/POS";
function App() {


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
