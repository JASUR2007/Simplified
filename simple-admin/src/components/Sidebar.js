import React from 'react';
import { Link } from 'react-router-dom';  
import './Sidebar.css';  
import 'bootstrap/dist/css/bootstrap.min.css'; 

const Sidebar = () => {
  return (
    <div style= {{
        "backgroundColor":"rgba(228, 245, 255, 1)",
        "boxShadow": "rgba(0, 0, 0, 0.1) 0px 10px 50px;"
      }}>
      <aside>
        <p>Menu</p>
        <Link to="/" className="sidebar-item">
          <i className="fa fa-home" aria-hidden="true"></i>
          Главная
        </Link>
        <Link to="/categories" className="sidebar-item">
          <i className="fa fa-list" aria-hidden="true"></i>
          Категория
        </Link>
        <Link to="/products" className="sidebar-item">
          <i className="fa fa-cogs" aria-hidden="true"></i>
          Товары
        </Link>
        <Link to="/cart" className="sidebar-item">
          <i className="fa fa-shopping-cart" aria-hidden="true"></i>
          Корзинка
        </Link>
      </aside>
    </div>
  );
};

export default Sidebar;
