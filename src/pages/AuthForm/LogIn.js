import React, { useState } from 'react';
import './LogIn.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const LoginForm = ({ switchForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.trim()) {
      setError("Your username cannot be blank.");
      return;
    }

    const userData = {
      email: email,
      password: password,
    };

    const apiUrl = 'http://localhost:8080/api/auth/login';

    try {
      const response = await axios.post(apiUrl, userData);
      console.log('Đăng nhập thành công:', response.data);
      const token = response.data.token;
      const user_id = response.data.user_id;
      const username = response.data.username;
      console.log(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('user_name', username);
      navigate('/lastest');

      return response.data;
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error.message);
      setError("The login details you entered are incorrect. Try again...");
    }
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = () => {
    console.log('Forgot Password:', email);
  };

  return (
    <div className="auth-form">
      <div className='username-email-container'>
        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={handleInputChange}
          placeholder='Enter your email'
          required />
      </div>

      <div className="password-container">
        <div className="header-of-password">
          <label>Mật khẩu:</label>
          <span className="forgot-password" onClick={handleForgotPassword}>Quên mật khẩu?</span>
        </div>


        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter your password'
          required
        />
        <FontAwesomeIcon
          icon={showPassword ? faEyeSlash : faEye}
          className="toggle-password-icon"
          onClick={() => setShowPassword(!showPassword)}
        />
      </div>

      <div className='noti-terms'>
        <p></p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className='button'>
        <button type="button" onClick={handleLogin}>Đăng nhập</button>
      </div>

      {/* Switch between Login and SignUp Form */}
      <button className='switch-status-btn' type='button' onClick={() => navigate('/signup')}>
        <span>Chưa có tài khoản? Đăng ký ngay!</span>
      </button>

    </div>
  );
};

export default LoginForm;

