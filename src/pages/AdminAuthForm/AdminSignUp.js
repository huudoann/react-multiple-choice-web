import React, { useState } from 'react';
import axios from "axios";
import { TextField, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

const SignUpForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignUp = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        if (!username.trim()) {
            setError("Nhập tên người dùng để tiếp tục!");
            return;
        }
        else if (!email.trim()) {
            setError("Nhập email để tiếp tục!");
            return;
        }
        else if (!emailRegex.test(email.trim())) {
            setError("Email không hợp lệ! Vui lòng nhập đúng định dạng email.");
            return;
        }
        else if (!password.trim()) {
            setError("Nhập mật khẩu để tiếp tục!");
            return;
        }
        else if (!passwordRegex.test(password.trim())) {
            setError("Mật khẩu cần phải có ít nhất 8 ký tự, trong đó có ít nhất 1 chữ hoa, 1 chữ thường và 1 số!");
            return;
        }
        else if (!confirmPassword.trim()) {
            setError("Cần phải xác nhận lại mật khẩu!");
            return;
        }
        else if (password.trim() !== confirmPassword.trim()) {
            setError("Mật khẩu không khớp!");
            return;
        }


        const userData = {
            username: username,
            email: email,
            password: password,
        };

        const apiUrl = 'http://localhost:8080/api/auth/signup-admin';

        try {
            const response = await axios.post(apiUrl, userData);
            console.log('Đăng ký thành công:', response.data);
            navigate('/dashboard_admin');

            return response.data;
        } catch (error) {
            console.error('Lỗi khi đăng ký:', error.message);
            throw error;
        }
    };

    const handleInputUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleInputEmailChange = (e) => {
        setEmail(e.target.value);
    };



    return (
        <div className="auth-form">
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
                    id="outlined-required"
                    label="Email"
                    value={email}
                    onChange={handleInputEmailChange}
                    placeholder='Nhập email của bạn'
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

                <TextField
                    required
                    id="outlined-password-input"
                    label="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Xác thực mật khẩu của bạn'
                    type="password"
                    autoComplete="current-password"
                />

                {error && <ErrorMessage message={error} />}
                <Button variant="contained" onClick={handleSignUp} style={{ width: '100%', marginBottom: '1rem', padding: '1rem' }}>Đăng ký</Button>

                <Button className='switch-status-btn' type='button' onClick={() => navigate('/login')} style={{ width: '100%', border: '1px solid #1976d2', padding: '1rem' }}>
                    <span>Đã có tài khoản? Đăng nhập ngay!</span>
                </Button>
            </Box>
        </div>
    );
};

export default SignUpForm;