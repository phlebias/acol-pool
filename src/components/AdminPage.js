import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import { playButtonSound } from '../utils/sound';
import './AdminPage.css';

function AdminPage() {
  const [formData, setFormData] = useState({
    collection: 'keyIdeas',
    name: '',
    text: ''
  });
  const [items, setItems] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    // Load items when component mounts or collection changes
    fetchItems(formData.collection);
  }, [formData.collection]);

  const fetchItems = async (collectionName) => {
    setError(null);
    try {
      console.log(`Fetching items from collection: ${collectionName}`);
      const querySnapshot = await getDocs(collection(firestore, collectionName));
      console.log(`Fetched ${querySnapshot.docs.length} items`);
      const itemsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemsList);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError(`Error fetching items: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    playButtonSound();
    
    if (!formData.name.trim() || !formData.text.trim()) {
      setError("Name and text are required");
      return;
    }
    
    try {
      console.log(`Adding item to collection: ${formData.collection}`, formData);
      
      // Create the document data, adding a development flag if in development mode
      const docData = {
        name: formData.name,
        text: formData.text
      };
      
      // Add development mode flag if in development environment
      if (isDevelopment) {
        docData.__dev_mode__ = true;
      }
      
      const docRef = await addDoc(collection(firestore, formData.collection), docData);
      console.log(`Document added with ID: ${docRef.id}`);
      setFormData({ ...formData, name: '', text: '' });
      setSuccess(`Item "${formData.name}" added successfully!`);
      fetchItems(formData.collection);
    } catch (error) {
      console.error('Error adding document:', error);
      setError(`Error adding document: ${error.message}`);
    }
  };

  const initiateDelete = (item) => {
    playButtonSound();
    setDeleteConfirm(item);
  };

  const cancelDelete = () => {
    playButtonSound();
    setDeleteConfirm(null);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setError(null);
    setSuccess(null);
    playButtonSound();
    
    try {
      console.log(`Deleting document with ID: ${deleteConfirm.id} from collection: ${formData.collection}`);
      await deleteDoc(doc(firestore, formData.collection, deleteConfirm.id));
      console.log('Document successfully deleted');
      setSuccess(`Item "${deleteConfirm.name}" deleted successfully!`);
      fetchItems(formData.collection);
    } catch (error) {
      console.error('Error deleting document:', error);
      setError(`Error deleting document: ${error.message}`);
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel</h1>
      
      {isDevelopment && (
        <div className="dev-mode-indicator" style={{ 
          backgroundColor: '#28a745', 
          color: 'white', 
          padding: '5px 10px', 
          borderRadius: '4px',
          marginBottom: '10px',
          display: 'inline-block'
        }}>
          Development Mode
        </div>
      )}
      
      {error && (
        <div className="error-message" style={{ color: 'red', margin: '10px 0', padding: '10px', backgroundColor: '#ffeeee', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message" style={{ color: 'green', margin: '10px 0', padding: '10px', backgroundColor: '#eeffee', borderRadius: '4px' }}>
          {success}
        </div>
      )}
      
      <form className="admin-form" onSubmit={handleSubmit}>
        <select
          className="admin-select"
          value={formData.collection}
          onChange={(e) => {
            playButtonSound();
            setFormData({ ...formData, collection: e.target.value });
          }}
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
          {items.length === 0 ? (
            <p>No items found in this collection.</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="item-card">
                <h3 className="item-name">{item.name}</h3>
                <button
                  className="btn delete-btn"
                  onClick={() => initiateDelete(item)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
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
    </div>
  );
}

export default AdminPage;

