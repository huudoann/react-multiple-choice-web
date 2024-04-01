import React, { useState } from 'react';
import './LogIn.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

const LoginForm = ({ switchForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim()) {
      setError("Nhập tên đăng nhập để tiếp tục!");
      return;
    }
    else if (!password.trim()) {
      setError("Nhập mật khẩu để tiếp tục!");
      return;
    }

    const userData = {
      username: username,
      password: password,
    };

    const apiUrl = 'http://localhost:8080/api/auth/login';

    try {
      const response = await axios.post(apiUrl, userData);
      console.log('Đăng nhập thành công:', response.data);
      const token = response.data.token;
      const userId = response.data.userId;
      const username = response.data.username;
      console.log(token);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('user_name', username);
      navigate('/home');

      return response.data;
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error.message);
      setError("Thông tin đăng nhập không chính xác! Hãy thử lại!");
    }
  };

  const handleInputUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleForgotPassword = () => {
    // console.log('Forgot Password:', email);
  };

  return (
    <div className="auth-form">
      <div className='username-container'>
        <label>Tên đăng nhập:</label>
        <input
          type="text"
          value={username}
          onChange={handleInputUsernameChange}
          placeholder='Nhập tên người dùng'
          required />
      </div>

      <div className="password-container">
        <div className="header-of-password">
          <label>Mật khẩu:</label>
        </div>


        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Nhập mật khẩu'
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
      <button className='switch-status-btn' type='button' onClick={() => navigate('/')}>
        <span>Chưa có tài khoản? Đăng ký ngay!</span>
      </button>

    </div>
  );
};

export default LoginForm;

