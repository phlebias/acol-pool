import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import firestore from '../firebase';
import './AdminPage.css';

function AdminPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    collection: 'keyIdeas',
    name: '',
    text: ''
  });
  const [items, setItems] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchItems(formData.collection);
  }, [formData.collection]);

  const fetchItems = async (collectionName) => {
    try {
      const querySnapshot = await getDocs(collection(firestore, collectionName));
      const itemsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemsList);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore, formData.collection), {
        name: formData.name,
        text: formData.text
      });
      setFormData({ ...formData, name: '', text: '' });
      fetchItems(formData.collection);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const initiateDelete = (item) => {
    setDeleteConfirm(item);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteDoc(doc(firestore, formData.collection, deleteConfirm.id));
      fetchItems(formData.collection);
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel</h1>
      <form className="admin-form" onSubmit={handleSubmit}>
        <select
          className="admin-select"
          value={formData.collection}
          onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
        >
          <option value="keyIdeas">Key Ideas</option>
          <option value="conventions">Conventions</option>
          <option value="rules">Rules</option>
        </select>
        <input
          className="admin-input"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <textarea
          className="admin-textarea"
          placeholder="Text (Use • at the start of a line for bullet points)"
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
        />
        <button type="submit" className="btn submit-btn">Add Item</button>
      </form>
      <div className="items-list-container">
        <h2 className="items-title">Current Items</h2>
        <div className="items-grid">
          {items.map(item => (
            <div key={item.id} className="item-card">
              <h3 className="item-name">{item.name}</h3>
              <button
                className="btn delete-btn"
                onClick={() => initiateDelete(item)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
      {deleteConfirm && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete "{deleteConfirm.name}"?</p>
            <p className="delete-warning">This action cannot be undone!</p>
            <div className="delete-modal-buttons">
              <button
                className="btn cancel-btn"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="btn confirm-delete-btn"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        className="btn back-btn"
        onClick={() => navigate('/main')}
      >
        Back to Main Page
      </button>
    </div>
  );
}

export default AdminPage;
