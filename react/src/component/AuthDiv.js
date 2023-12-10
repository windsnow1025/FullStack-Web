import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';

function AuthDiv() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsername();
  }, []);

  const fetchUsername = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUsername(null);
      return;
    }
    try {
      const res = await axios.get('/api/auth/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsername(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      setUsername(null);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUsername(null);
  };

  return (
    <div>
      {username ? (
        <div className="Flex-space-around">
          <span>{username}</span>
          <a href="/user-center">
            <FontAwesomeIcon icon={faUser} />
          </a>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div className="Flex-space-around">
          <button onClick={() => navigate('/signin')}>Sign in</button>
          <button onClick={() => navigate('/signup')}>Sign up</button>
        </div>
      )}
    </div>
  );
}

export default AuthDiv;
