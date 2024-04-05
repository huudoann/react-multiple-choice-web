import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminAuth.scss';
import Login from '../AuthForm/LogIn.js';
import AdminSignUp from './AdminSignUp.js';

const AuthPage = () => {
  const [currentForm, setCurrentForm] = useState('/admin-register');
  const navigate = useNavigate();


  const switchForm = (formType) => {
    setCurrentForm(formType);
  };

  useEffect(() => {
    // Perform operations when change status
  }, [currentForm]);


  return (
    <div className="auth-page-container">

      <div className="auth-form-container">

        <div className='form-box'>
          <div className="auth-tabs">
            <button className={currentForm === '/admin-register' ? 'active' : ''} onClick={() => navigate('/admin-register')}>Đăng ký quản trị viên</button>
          </div>

          {currentForm === 'admin-login' ? (
            <Login switchForm={switchForm} />
          ) : (
            <AdminSignUp switchForm={switchForm} />
          )}
        </div>
      </div>


    </div>
  );
};

export default AuthPage;