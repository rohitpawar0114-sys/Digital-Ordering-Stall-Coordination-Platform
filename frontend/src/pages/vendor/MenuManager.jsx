import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import vendorService from '../../api/vendorService';

const MenuManager = () => {
    const [categories, setCategories] = useState([]);
    const [foods, setFoods] = useState([]);
    const [outlet, setOutlet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('foods');

    // Form States
    const [newCategory, setNewCategory] = useState('');
    const [foodFormData, setFoodFormData] = useState({
        foodName: '',
        description: '',
        price: '',
        categoryId: '',
        veg: true,
        available: true,
        imageUrls: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const outletData = await vendorService.getOutlet();
            setOutlet(outletData);

            if (outletData) {
                const [catData, foodData] = await Promise.all([
                    vendorService.getCategories(outletData.outletId),
                    vendorService.getFoods(outletData.outletId)
                ]);
                setCategories(catData || []);
                setFoods(foodData || []);
            }
        } catch (err) {
            console.error('Error fetching menu data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!outlet) {
            alert('⚠️ No outlet found! Please set up your outlet in Settings first.');
            return;
        }
        try {
            await vendorService.addCategory(newCategory, outlet.outletId);
            setNewCategory('');
            await fetchData();
            // Close modal safely (if on food tab or similar)
            const closeBtn = document.querySelector('#addCategoryModal [data-bs-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
        } catch (err) {
            console.error('Error adding category:', err);
            alert('❌ Failed to add category: ' + (err.response?.data?.message || 'Unknown error'));
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('❓ Delete this category? All items in it will be unassigned.')) return;
        try {
            await vendorService.deleteCategory(id);
            await fetchData();
        } catch (err) {
            console.error('Error deleting category:', err);
            alert('❌ Failed to delete category');
        }
    };

    const handleAddFood = async (e) => {
        e.preventDefault();
        if (!outlet) return;
        try {
            const data = { ...foodFormData, outletId: outlet.outletId };
            console.log('Adding food item:', data);
            await vendorService.addFoodItem(data);

            // Reset form
            setFoodFormData({
                foodName: '',
                description: '',
                price: '',
                categoryId: '',
                veg: true,
                available: true,
                imageUrls: []
            });

            // Refresh data
            await fetchData();

            // Close modal safely
            const closeBtn = document.querySelector('#addFoodModal [data-bs-dismiss="modal"]');
            if (closeBtn) {
                closeBtn.click();
            } else {
                // Fallback for unresponsive UI
                document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
            }
        } catch (err) {
            console.error('Error adding food item:', err);
            alert('Failed to add food item. Check console for details.');
        }
    };

    const toggleAvailability = async (food) => {
        try {
            await vendorService.updateFoodItem(food.foodId, {
                ...food,
                available: !food.available
            });
            fetchData();
        } catch (err) {
            alert('Failed to update availability');
        }
    };

    const handleDeleteFood = async (id) => {
        if (!window.confirm('Delete this food item?')) return;
        try {
            await vendorService.deleteFoodItem(id);
            fetchData();
        } catch (err) {
            alert('Failed to delete food item');
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-orange"></div></div>;

    return (
        <div className="container-fluid py-4 px-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                <div>
                    <h2 className="fw-bold mb-1">Menu Management</h2>
                    <p className="text-muted mb-0">Organize your categories and update food items.</p>
                </div>
                {activeTab === 'foods' && outlet && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-orange rounded-pill px-4 py-2 fw-bold shadow-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#addFoodModal"
                    >
                        <i className="bi bi-plus-lg me-2"></i> Add New Item
                    </motion.button>
                )}
            </div>

            {!outlet ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card border-0 shadow-premium rounded-4 p-5 text-center bg-white"
                >
                    <div className="mb-4">
                        <div className="bg-orange bg-opacity-10 p-4 rounded-circle d-inline-block">
                            <i className="bi bi-shop fs-1 text-orange"></i>
                        </div>
                    </div>
                    <h3 className="fw-bold text-dark">Setup Required</h3>
                    <p className="text-muted mx-auto mb-4 lead" style={{ maxWidth: '500px' }}>
                        Your menu needs a home! Please configure your outlet details to start adding delicious items.
                    </p>
                    <a href="/vendor/settings" className="btn btn-dark rounded-pill px-5 py-3 fw-bold shadow-sm">
                        Go to Settings
                    </a>
                </motion.div>
            ) : (
                <>
                    <div className="d-flex justify-content-center justify-content-md-start mb-4">
                        <div className="bg-white p-1 rounded-pill shadow-sm d-inline-flex border">
                            <button className={`btn rounded-pill px-4 py-2 border-0 fw-bold transition-all ${activeTab === 'foods' ? 'bg-orange text-white shadow-sm' : 'text-muted hover-bg-light'}`}
                                onClick={() => setActiveTab('foods')}>Food Items</button>
                            <button className={`btn rounded-pill px-4 py-2 border-0 fw-bold transition-all ${activeTab === 'categories' ? 'bg-orange text-white shadow-sm' : 'text-muted hover-bg-light'}`}
                                onClick={() => setActiveTab('categories')}>Categories</button>
                        </div>
                    </div>

                    <AnimatePresence mode='wait'>
                        {activeTab === 'categories' ? (
                            <motion.div
                                key="categories"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="row g-4"
                            >
                                <div className="col-md-4">
                                    <div className="card border-0 shadow-premium rounded-4 p-4 h-100">
                                        <h5 className="fw-bold mb-3">Add Category</h5>
                                        <form onSubmit={handleAddCategory}>
                                            <div className="mb-3">
                                                <label className="form-label small fw-bold text-uppercase tracking-wider text-muted">Category Name</label>
                                                <input type="text" className="form-control bg-light border-0 py-3 rounded-3" placeholder="e.g. Burgers, Drinks"
                                                    value={newCategory} onChange={e => setNewCategory(e.target.value)} required />
                                            </div>
                                            <button type="submit" className="btn btn-orange w-100 rounded-pill py-3 fw-bold shadow-sm">Create Category</button>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="card border-0 shadow-premium rounded-4 overflow-hidden h-100">
                                        <div className="table-responsive">
                                            <table className="table table-hover mb-0 align-middle">
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th className="px-4 py-3 border-0 text-uppercase small text-muted font-monospace">Name</th>
                                                        <th className="py-3 border-0 text-uppercase small text-muted font-monospace">Items</th>
                                                        <th className="py-3 border-0 text-end px-4 text-uppercase small text-muted font-monospace">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {categories.map(cat => (
                                                        <tr key={cat.categoryId}>
                                                            <td className="px-4 py-3 fw-bold">{cat.categoryName}</td>
                                                            <td className="py-3 text-muted">
                                                                <span className="badge bg-light text-dark border rounded-pill px-3">
                                                                    {foods.filter(f => f.categoryId === cat.categoryId).length} Items
                                                                </span>
                                                            </td>
                                                            <td className="py-3 text-end px-4">
                                                                <button className="btn btn-sm btn-outline-danger border-0 rounded-circle" onClick={() => handleDeleteCategory(cat.categoryId)}>
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {categories.length === 0 && (
                                                        <tr>
                                                            <td colSpan="3" className="text-center py-5 text-muted">
                                                                No categories found. Create one to get started!
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="foods"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="row g-4"
                            >
                                {foods.length > 0 ? (
                                    foods.map((food, index) => (
                                        <motion.div
                                            key={food.foodId}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="col-md-6 col-xl-4"
                                        >
                                            <div className="card border-0 shadow-premium rounded-4 overflow-hidden h-100 p-2 position-relative group-hover">
                                                <div className="d-flex h-100 p-2 gap-3 align-items-center">
                                                    <div className="position-relative" style={{ width: '110px', height: '110px', flexShrink: 0 }}>
                                                        {food.imageUrls?.[0] ? (
                                                            <img src={food.imageUrls[0]} className="rounded-4 w-100 h-100 shadow-sm object-fit-cover" alt={food.foodName} />
                                                        ) : (
                                                            <div className="bg-light rounded-4 w-100 h-100 d-flex align-items-center justify-content-center text-muted shadow-inner">
                                                                <i className="bi bi-egg-fried fs-3 opacity-50"></i>
                                                            </div>
                                                        )}
                                                        <div className="position-absolute top-0 start-0 m-1">
                                                            <span className={`badge rounded-circle border p-1 ${food.veg ? 'bg-success border-success text-white' : 'bg-danger border-danger text-white'}`}
                                                                style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                                title={food.veg ? 'Vegetarian' : 'Non-Vegetarian'}>
                                                                <i className="bi bi-circle-fill" style={{ fontSize: '0.4rem' }}></i>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                                            <h6 className="fw-bold mb-0 text-truncate text-dark">{food.foodName}</h6>
                                                            <div className="form-check form-switch m-0 ms-2">
                                                                <input className="form-check-input shadow-none cursor-pointer" type="checkbox" checked={food.available}
                                                                    onChange={() => toggleAvailability(food)} title="Toggle Availability" />
                                                            </div>
                                                        </div>

                                                        <p className="text-muted small mb-2 text-truncate opacity-75">{food.description || 'No description'}</p>

                                                        <div className="d-flex justify-content-between align-items-end mt-2">
                                                            <h5 className="fw-bold text-orange mb-0">₹{food.price}</h5>
                                                            <button
                                                                className="btn btn-link text-danger p-0 border-0 opacity-50 hover-opacity-100 transition-all"
                                                                onClick={() => handleDeleteFood(food.foodId)}
                                                            >
                                                                <i className="bi bi-trash-fill fs-5"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {!food.available && (
                                                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-50 rounded-4 d-flex align-items-center justify-content-center backdrop-blur-sm z-1"
                                                        style={{ pointerEvents: 'none' }}>
                                                        <span className="badge bg-dark rounded-pill px-3 py-2 shadow-sm">UNAVAILABLE</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-12 py-5 text-center">
                                        <div className="bg-light rounded-circle p-4 d-inline-block mb-3">
                                            <i className="bi bi-journal-plus fs-1 text-muted opacity-50"></i>
                                        </div>
                                        <h5 className="fw-bold text-muted">Menu is empty</h5>
                                        <p className="text-muted small">Add your first item to get started!</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Add Food Modal (Enhanced Styiling) */}
                    <div className="modal fade" id="addFoodModal" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content border-0 rounded-4 shadow-lg">
                                <div className="modal-header border-0 p-4 pb-0">
                                    <div>
                                        <h4 className="fw-bold m-0 text-dark">Add New Item</h4>
                                        <p className="text-muted small mb-0">Create a tasty addition to your menu</p>
                                    </div>
                                    <button type="button" className="btn-close bg-light rounded-circle p-2" data-bs-dismiss="modal"></button>
                                </div>
                                <div className="modal-body p-4 pt-3">
                                    <form onSubmit={handleAddFood}>
                                        <div className="mb-4">
                                            <label className="form-label small fw-bold text-uppercase tracking-wider text-muted">Item Name</label>
                                            <input type="text" className="form-control bg-light border-0 py-3 rounded-3" required placeholder="e.g. Masala Dosa"
                                                value={foodFormData.foodName} onChange={e => setFoodFormData({ ...foodFormData, foodName: e.target.value })} />
                                        </div>
                                        <div className="row g-4 mb-4">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-uppercase tracking-wider text-muted">Price (₹)</label>
                                                <div className="input-group">
                                                    <span className="input-group-text border-0 bg-light rounded-start-3 ps-3 text-muted fw-bold">₹</span>
                                                    <input type="number" className="form-control bg-light border-0 py-3 rounded-end-3" required placeholder="0.00"
                                                        value={foodFormData.price} onChange={e => setFoodFormData({ ...foodFormData, price: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-uppercase tracking-wider text-muted">Category</label>
                                                <select className="form-select bg-light border-0 py-3 rounded-3" required
                                                    value={foodFormData.categoryId} onChange={e => setFoodFormData({ ...foodFormData, categoryId: e.target.value })}>
                                                    <option value="">Select Category...</option>
                                                    {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label small fw-bold text-uppercase tracking-wider text-muted">Description</label>
                                            <textarea className="form-control bg-light border-0 py-3 rounded-3" rows="3" placeholder="Describe ingredients, taste, etc."
                                                value={foodFormData.description} onChange={e => setFoodFormData({ ...foodFormData, description: e.target.value })}></textarea>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label small fw-bold text-uppercase tracking-wider text-muted">Image URL</label>
                                            <input type="text" className="form-control bg-light border-0 py-3 rounded-3" placeholder="https://example.com/image.jpg"
                                                onChange={e => setFoodFormData({ ...foodFormData, imageUrls: [e.target.value] })} />
                                        </div>

                                        <div className="p-3 bg-light rounded-4 mb-4 border border-light">
                                            <div className="d-flex gap-4">
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" id="vegCheck" checked={foodFormData.veg}
                                                        onChange={e => setFoodFormData({ ...foodFormData, veg: e.target.checked })} />
                                                    <label className="form-check-label fw-bold ms-2" htmlFor="vegCheck">Vegetarian</label>
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" id="availCheck" checked={foodFormData.available}
                                                        onChange={e => setFoodFormData({ ...foodFormData, available: e.target.checked })} />
                                                    <label className="form-check-label fw-bold ms-2" htmlFor="availCheck">Available Now</label>
                                                </div>
                                            </div>
                                        </div>

                                        <button type="submit" className="btn btn-orange w-100 rounded-pill py-3 fw-bold shadow-sm custom-btn-hover">
                                            <i className="bi bi-plus-circle me-2"></i> Add Food Item
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MenuManager;
