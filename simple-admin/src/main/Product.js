import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    categoryId: '',
    description: '',
    img: null,
  });
  const [previewImg, setPreviewImg] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch('http://localhost:5000/api/products');
        const productsData = await productResponse.json();
        setProducts(productsData);

        const categoryResponse = await fetch('http://localhost:5000/api/categories');
        const categoriesData = await categoryResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }};

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      } else {
        alert('Не удалось удалить товар.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }};
  const openSidebar = (product = null) => {
    setEditProduct(product);
    setNewProduct(
      product || {
        name: '',
        categoryId: '',
        description: '',
        img: null,
      }
    );
    setPreviewImg(product?.img || null);
    setShowSidebar(true);
  };
  const closeSidebar = () => {
    setEditProduct(null);
    setNewProduct({ name: '', categoryId: '', description: '', img: null });
    setPreviewImg(null);
    setShowSidebar(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, img: file });
      setPreviewImg(URL.createObjectURL(file));
    }};

  const handleSave = async () => {
    if (!newProduct.name || !newProduct.categoryId || !newProduct.description || !newProduct.img) {
      alert('Пожалуйста, заполните все поля!');
      return;
    }
    console.log(newProduct)
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('categoryId', newProduct.categoryId);
    formData.append('description', newProduct.description);
    editProduct ? 
    formData.append('image', newProduct.img) :
    formData.append('img', newProduct.img) 
    const url = editProduct
      ? `http://localhost:5000/api/products/${editProduct.id}`
      : 'http://localhost:5000/api/products';
    const method = editProduct ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, { method, body: formData });
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      const data = await response.json();
      setProducts((prev) =>
        editProduct ? prev.map((p) => (p.id === data.id ? data : p)) : [...prev, data]
      );
      closeSidebar();
    } catch (error) {
      alert(`Не удалось сохранить: ${error.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Товары</h2>
            <FaPlus
              className="text-success"
              style={{ cursor: 'pointer', fontSize: '1.5rem' }}
              onClick={() => openSidebar()}
            />
          </div>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Наименование</th>
                <th>Категория</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>
                    {categories.find((cat) => cat.id === +product.categoryId)?.name || 'Неизвестно'}
                  </td>
                  <td>
                    <FaEdit
                      className="text-primary me-3"
                      style={{ cursor: 'pointer' }}
                      onClick={() => openSidebar(product)}
                    />
                    <FaTrash
                      className="text-danger"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDelete(product.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showSidebar && (
          <div className="col-md-3">
            <div className="bg-light p-3 border rounded">
              <h5>{editProduct ? 'Редактировать товар' : 'Добавить товар'}</h5>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Название"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}/>
              <select
                className="form-control mb-2"
                value={newProduct.categoryId}
                onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}>
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <textarea
                className="form-control mb-2"
                placeholder="Описание"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}/>
              <input type="file" className="form-control mb-2" onChange={handleImageUpload} />
              {previewImg && (
                <div className="text-center mt-3">
                  <img
                    src={previewImg}
                    alt="Превью изображения"
                    style={{ maxWidth: '100%', maxHeight: '150px' }}/>
                </div>
              )}
              <button className="btn btn-primary mt-3 w-100" onClick={handleSave}>
                Сохранить
              </button>
              <button className="btn btn-secondary mt-2 w-100" onClick={closeSidebar}>
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Product;
