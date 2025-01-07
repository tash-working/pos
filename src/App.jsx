import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Category from "./components/category/Category";
import SingleItem from "./components/category/items/singleItem/SingleItem";
import Cart from "./components/cart/Cart";
import History from "./components/category/history/History";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/exm/Dashboard";
import Login from "./components/login/Login";
import Register from "./components/login/Register";
import ItemsHistory from "./components/category/history/ItemsHistory";
import Settings from "./components/settings/Settings";
import Wrapper from "./components/wrapper/Wrapper";
import Home from "./home/Home";
import EditMenu from "./components/edit_menu/EditMenu";
import DeleteItem from "./components/edit_menu/DeleteItem";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes Wrapped by Wrapper */}
        <Route
          path="/:id"
          element={
            <Wrapper>
              <Cart />
            </Wrapper>
          }
        />
        <Route
          path="/:id/settings"
          element={
            <Wrapper>
              <Settings />
            </Wrapper>
          }
        />
        <Route
          path="/:id/settings/add_item"
          element={
            <Wrapper>
              <EditMenu/>
            </Wrapper>
          }
        />
        <Route
          path="/:id/settings/delete_item"
          element={
            <Wrapper>
              <DeleteItem/>
            </Wrapper>
          }
        />
        <Route
          path="/:id/dashboard/history"
          element={
            <Wrapper>
              <History />
            </Wrapper>
          }
        />
        <Route
          path="/:id/dashboard/history_items"
          element={
            <Wrapper>
              <ItemsHistory />
            </Wrapper>
          }
        />
        <Route
          path="/:id/dashboard"
          element={
            <Wrapper>
              <Dashboard />
            </Wrapper>
          }
        />
        <Route
          path="/:id/:category"
          element={
            <Wrapper>
              <Category />
            </Wrapper>
          }
        />
        <Route
          path="/:id/:category/:singleItem"
          element={
            <Wrapper>
              <SingleItem />
            </Wrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
