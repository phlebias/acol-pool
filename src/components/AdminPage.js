import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, deleteDoc, doc, getDocs, serverTimestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { firestore, auth } from '../firebase';
import './AdminPage.css';

function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [formData, setFormData] = useState({
    collection: 'keyIdeas',
    name: '',
    text: ''
  });
  const [items, setItems] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const audioRef = useRef(new Audio('/sounds/shuffle.mp3')); // Create a reference to the audio element

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setUserEmail(user?.email || '');
    });
    return () => unsubscribe();
  }, []);

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
      // Ensure the user is authenticated
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      await addDoc(collection(firestore, formData.collection), {
        name: formData.name,
        text: formData.text,
        userId: user.uid,
        timestamp: serverTimestamp()
      });
      setFormData({ ...formData, name: '', text: '' });
      fetchItems(formData.collection);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      setIsAuthenticated(true); // Set isAuthenticated to true upon successful login
      setLoginError('');
    } catch (error) {
      setLoginError('Invalid credentials. Please try again.');
      console.error('Login error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/main');
    } catch (error) {
      console.error('Error signing out:', error);
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

  const playSound = () => {
    const audio = audioRef.current;
    console.log('Attempting to play sound...');
    
    audio.play()
      .then(() => {
        console.log('Sound played successfully');
      })
      .catch((error) => {
        console.error('Failed to play sound:', error);
      });
  };

  // Test the audio loading
  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('loadeddata', () => {
      console.log('Audio file loaded successfully');
    });
    audio.addEventListener('error', (e) => {
      console.error('Audio loading error:', e);
    });
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <h1 className="admin-title">Admin Login</h1>
        <form className="admin-login-form" onSubmit={handleLogin}>
          <input
            className="admin-login-input"
            type="email"
            placeholder="Admin Email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            required
          />
          <input
            className="admin-login-input"
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            required
          />
          {loginError && <p className="error-message">{loginError}</p>}
          <button type="submit" className="login-btn">Login</button>
        </form>
        <button
          className="btn back-btn"
          onClick={() => navigate('/main')}
          style={{ marginTop: '1rem' }}
        >
          Back to Main Page
        </button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Admin Panel</h1>
        <div className="user-info">
          <span>Logged in as: {userEmail}</span>
          <button className="btn sign-out-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
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
      <button onClick={playSound}>Play Shuffle Sound</button> {/* Button to trigger sound */}
    </div>
  );
}

export default AdminPage;
