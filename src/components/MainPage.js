import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import firestore from '../firebase';
import './MainPage.css';

function MainPage() {
  const navigate = useNavigate();
  const [keyIdeas, setKeyIdeas] = useState([]);
  const [conventions, setConventions] = useState([]);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchCollection = async (collectionName) => {
        try {
          const querySnapshot = await getDocs(collection(firestore, collectionName));
          return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } catch (error) {
          console.error(`Error fetching ${collectionName}:`, error);
          return [];
        }
      };

      try {
        const [keyIdeasData, conventionsData, rulesData] = await Promise.all([
          fetchCollection('keyIdeas'),
          fetchCollection('conventions'),
          fetchCollection('rules')
        ]);

        setKeyIdeas(keyIdeasData);
        setConventions(conventionsData);
        setRules(rulesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

  return (
    <div className="main-container">
      <h1 className="main-title">Bridge Reference Guide</h1>
      
      <div className="sections-grid">
        <section className="main-section">
          <h2 className="section-title">Key Ideas</h2>
          <div className="items-list">
            {keyIdeas.map(item => (
              <div key={item.id} className="item">
                <button 
                  className="btn item-btn"
                  onClick={() => navigate(`/content/keyIdeas/${item.id}`)}
                >
                  {item.name}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="main-section">
          <h2 className="section-title">Conventions</h2>
          <div className="items-list">
            {conventions.map(item => (
              <div key={item.id} className="item">
                <button 
                  className="btn item-btn"
                  onClick={() => navigate(`/content/conventions/${item.id}`)}
                >
                  {item.name}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="main-section">
          <h2 className="section-title">The Rules</h2>
          <div className="items-list">
            {rules.map(item => (
              <div key={item.id} className="item">
                <button 
                  className="btn item-btn"
                  onClick={() => navigate(`/content/rules/${item.id}`)}
                >
                  {item.name}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {isLocalhost && (
        <button 
          className="btn admin-btn"
          onClick={() => navigate('/admin')}
        >
          Admin Page
        </button>
      )}
    </div>
  );
}

export default MainPage;
