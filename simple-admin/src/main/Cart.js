import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const handleRemove = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Корзина</h2>
      {cart.length === 0 ? (
        <p className="text-center">Ваша корзина пуста.</p>
      ) : (
        <div className="row">
          {cart.map((item) => (
            <div key={item.id} className="col-md-4 mb-4">
              <div className="card">
                {item.image && (
                  <img
                    src={"http://localhost:5000" + item.image} 
                    alt={item.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                  <button
                    className="btn btn-danger w-100"
                    onClick={() => handleRemove(item.id)}>
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;
