import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import Sidebar from "./components/Sidebar";
import Category from "./main/Category";
import Product from "./main/Product";
import Home from "./pages/Home";
import Cart from "./main/Cart";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <div className="wrapper">
        <Sidebar />
        <div style={{"width": "100%",height: "100vh","flex-grow": '1',"background-color": "whitesmoke"}}>
          <Header />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Category />} />
              <Route path="/products" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
