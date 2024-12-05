import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaShoppingCart } from 'react-icons/fa';

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoryResponse = await fetch('http://localhost:5000/api/categories');
        if (!categoryResponse.ok) {
          throw new Error('Ошибка при загрузке категорий');
        }
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);

        const productResponse = await fetch('http://localhost:5000/api/products');
        if (!productResponse.ok) {
          throw new Error('Ошибка при загрузке товаров');
        }
        const productData = await productResponse.json();
        setProducts(productData);
        console.log(productData)
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
        setError(null); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addToCart = (product) => {
    if (cart.some((item) => item.id === product.id)) return;
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === +categoryId);
    return category ? category.name : 'Неизвестная категория';
  };
  if (loading) {
    return <div className="text-center mt-5">Загрузка...</div>;
  }
  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }
  if (!products.length) {
    return <div className="alert alert-warning text-center mt-5">Товары отсутствуют</div>;
  }
  return (
    <div className="home container mt-5">
      <h2 className="text-center mb-5">Главная</h2>
      <div className="product-list row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card shadow-sm position-relative">
              <img 
                src={'http://localhost:5000' + product.image} 
                className="card-img-top" 
                alt={product.name} 
              />
              {cart.some((item) => item.id === product.id) && (
                <FaShoppingCart
                  className="position-absolute top-0 end-0 m-2"
                  style={{ fontSize: '24px', color: 'green' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">
                  <strong>Категория: </strong>
                  {getCategoryName(product.categoryId)}
                </p>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => addToCart(product)}
                  disabled={cart.some((item) => item.id === product.id)}>
                  {cart.some((item) => item.id === product.id) ? 'Добавлено' : 'Добавить в корзину'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
