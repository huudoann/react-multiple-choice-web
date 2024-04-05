import React, { useState } from 'react';
import axios from "axios";
import { TextField, Box, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

const AdminLogIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      // Gọi hàm lấy thông tin người dùng sau khi đăng nhập
      await getUserInfo(username);

      return response.data;
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error.message);
      setError("Thông tin đăng nhập không chính xác! Hãy thử lại!");
    }
  };

  const getUserInfo = async (username) => {
    const apiUrl = `http://localhost:8080/api/user/${username}`;

    try {
      const response = await axios.get(apiUrl);
      console.log('Thông tin người dùng:', response.data);

      const userRole = response.data.role;
      console.log(userRole);
      if (userRole === 'ADMIN') {
        // Chuyển hướng đến trang ADMIN
        navigate('/dashboard_admin');
      } else {
        // Chuyển hướng đến trang USER
        navigate('/home');
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error.message);
      setError("Lỗi khi lấy thông tin người dùng!");
    }
  };

  const handleInputUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div className='auth-form'>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { marginBottom: '1rem', width: '100%' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          required
          id="outlined-required"
          label="Tên đăng nhập"
          value={username}
          onChange={handleInputUsernameChange}
          placeholder='Nhập tên người dùng'
        />

        <TextField
          required
          id="outlined-password-input"
          label="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Nhập mật khẩu'
          type="password"
          autoComplete="current-password"
        />

        {error && <ErrorMessage message={error} />}
        <Button variant="contained" onClick={handleLogin} style={{ width: '100%', marginBottom: '1rem', padding: '1rem' }}>Đăng nhập</Button>

        <Button className='switch-status-btn' type='button' onClick={() => navigate('/')} style={{ width: '100%', border: '1px solid #1976d2', padding: '1rem' }}>
          <span>Chưa có tài khoản? Đăng ký ngay!</span>
        </Button>
      </Box>

    </div >
  );
};

export default AdminLogIn;

