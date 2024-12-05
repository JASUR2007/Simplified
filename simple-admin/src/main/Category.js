import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Category() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '' });

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);
  const handleSaveCategory = () => {
    if (selectedCategory) {
      const updatedCategory = { ...selectedCategory, name: newCategory.name };
      fetch(`http://localhost:5000/api/categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCategory),
      })
        .then((response) => response.json())
        .then((updatedCategoryData) => {
          const updatedCategories = categories.map((category) =>
            category.id === selectedCategory.id ? updatedCategoryData : category
          );
          setCategories(updatedCategories);
          setShowSidebar(false);
        })
        .catch((error) => console.error('Error updating category:', error));
    } else {
      const newCategoryData = { name: newCategory.name };
      fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategoryData),
      })
        .then((response) => response.json())
        .then((newCategoryData) => {
          setCategories([...categories, newCategoryData]);
          setShowSidebar(false);
        })
        .catch((error) => console.error('Error adding category:', error));
    }
  };

  const handleDeleteCategory = (id) => {
    fetch(`http://localhost:5000/api/categories/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setCategories(categories.filter((category) => category.id !== id));
        }
      })
      .catch((error) => console.error('Error deleting category:', error));
  };

  const handleShowSidebar = (category = null) => {
    setSelectedCategory(category);
    setNewCategory(category ? { ...category } : { name: '' });
    setShowSidebar(true);
  };
  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Категории</h2>
      <div className="d-flex justify-content-between">
        <button className="btn btn-success" onClick={() => handleShowSidebar()}>
          Добавить категорию
        </button>
      </div>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Наименование</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  Удалить
                </button>
                <button
                  className="btn btn-warning btn-sm ml-2"
                  onClick={() => handleShowSidebar(category)}
                >
                  Редактировать
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showSidebar && (
        <div
          className="sidebar"
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '400px',
            height: '100%',
            backgroundColor: '#fff',
            boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.1)',
            zIndex: 1050,
            padding: '20px',
            overflowY: 'auto',
            transition: 'transform 0.3s ease-in-out',
            transform: showSidebar ? 'translateX(0)' : 'translateX(100%)',
          }}>
          <div className="d-flex justify-content-between">
            <h5>{selectedCategory ? 'Редактировать категорию' : 'Добавить категорию'}</h5>
            <button style={{border: "inset"}} className="close" onClick={handleCloseSidebar}>
              &times;
            </button>
          </div>
          <div className="form-group">
            <label htmlFor="name">Наименование</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={newCategory.name}
              onChange={handleCategoryChange}
              style={{marginTop: "30px"}}/>
          </div>
          <div style={{
                display: "flex",
                justifyContent: "flex-end"
          }}> 
            <button style={{marginTop: "10px"}} className="btn btn-primary" onClick={handleSaveCategory}>
              {selectedCategory ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Category;
