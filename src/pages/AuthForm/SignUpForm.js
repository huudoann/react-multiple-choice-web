import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogIn from './LogIn.js';
import SignUp from './SignUp.js';
import './Auth.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBell, faUser, faStickyNote, faFolder, faUsers, faTimes, } from '@fortawesome/free-solid-svg-icons';

const AuthPage = () => {
  const [currentForm, setCurrentForm] = useState('/');
  const [isCloseButton, setIsCloseButton] = useState(false);
  const navigate = useNavigate();


  const switchForm = (formType) => {
    setCurrentForm(formType);
  };

  useEffect(() => {
    // Perform operations when change status
  }, [currentForm]);

  // const toggleCloseButton = () => {
  //   setIsCloseButton(!isCloseButton);
  //   navigate('/');
  // }

  return (
    <div className="auth-page-container">

      {/* <div className="auth-image-container" >
      </div> */}

      <div className="auth-form-container">

        <div className='form-box'>
          <div className="auth-tabs">
            <button className={currentForm === '/' ? 'active' : ''} onClick={() => navigate('/')}>Đăng ký</button>
            <button className={currentForm === 'login' ? 'active' : ''} onClick={() => navigate('/login')}>Đăng nhập</button>
            {/* <button className="close-icon" onClick={toggleCloseButton}><FontAwesomeIcon icon={faTimes} /></button> */}
          </div>

          {currentForm === 'login' ? (
            <LogIn switchForm={switchForm} />
          ) : (
            <SignUp switchForm={switchForm} />
          )}
        </div>
      </div>


    </div>
  );
};

export default AuthPage;