import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const FoodManagement = () => {
    const [categories, setCategories] = useState([]);
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState('');
    const [newFood, setNewFood] = useState({ name: '', price: '', description: '', categoryId: '' });

    const fetchData = async () => {
        try {
            // In a real app, we'd fetch the owner's outlet first to get its ID
            const outletsRes = await api.get('/api/outlets');
            // Assuming the owner has one outlet, we find it (mock logic for demo if needed, 
            // but we use the owner APIs which handle context on backend)

            // For categories and food, the backend owner controller handles the outlet context
            const catRes = await api.get('/api/owner/categories'); // Custom endpoint if it exists, or just use outlets/id/menu
            const menuRes = await api.get('/api/owner/food'); // Custom endpoint

            setCategories(catRes.data);
            setFoodItems(menuRes.data);
        } catch (error) {
            console.error('Error fetching food data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/owner/category', { name: newCategory });
            setNewCategory('');
            fetchData();
        } catch (error) {
            alert('Error adding category');
        }
    };

    const handleAddFood = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/owner/food', newFood);
            setNewFood({ name: '', price: '', description: '', categoryId: '' });
            fetchData();
        } catch (error) {
            alert('Error adding food item');
        }
    };

    if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-orange"></div></div>;

    return (
        <div className="container py-5">
            <h1 className="fw-bold mb-5">Manage <span className="text-orange">Menu</span></h1>

            <div className="row g-5">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <h5 className="fw-bold mb-4">Add Category</h5>
                        <form onSubmit={handleAddCategory}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control rounded-pill"
                                    placeholder="e.g. Beverages, Mains"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-orange w-100 rounded-pill">Add Category</button>
                        </form>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold mb-4">Your Categories</h5>
                        <ul className="list-group list-group-flush">
                            {categories.map(cat => (
                                <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                    {cat.name}
                                    <span className="badge bg-light text-muted rounded-pill">ID: {cat.id}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <h5 className="fw-bold mb-4">Add Food Item</h5>
                        <form onSubmit={handleAddFood} className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">Food Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newFood.name}
                                    onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">Price (₹)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={newFood.price}
                                    onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label small fw-bold">Category</label>
                                <select
                                    className="form-select"
                                    value={newFood.categoryId}
                                    onChange={(e) => setNewFood({ ...newFood, categoryId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-12">
                                <label className="form-label small fw-bold">Description</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    value={newFood.description}
                                    onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="col-12 text-end">
                                <button type="submit" className="btn btn-orange px-4 rounded-pill">Add Item</button>
                            </div>
                        </form>
                    </div>

                    <h5 className="fw-bold mb-4">Current Menu Items</h5>
                    <div className="row g-3">
                        {foodItems.map(item => (
                            <div key={item.id} className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 p-3 h-100 mt-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="fw-bold mb-0">{item.name}</h6>
                                            <small className="text-muted">{item.category?.name}</small>
                                        </div>
                                        <span className="fw-bold text-orange">₹{item.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodManagement;
