import React, { useState } from 'react';
import './SignUp.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

const SignUpForm = ({ switchForm }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            setError("Nhập mật khẩu đểu tiếp tục!");
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

        const termsChecked = document.getElementById('squaredcheck').checked;
        if (!termsChecked) {
            setError("Vui lòng đồng ý với các điều khoản và dịch vụ!");
            return;
        }

        const userData = {
            username: username,
            email: email,
            password: password,
        };

        const apiUrl = 'http://localhost:8080/api/auth/signup';

        try {
            const response = await axios.post(apiUrl, userData);
            console.log('Đăng ký thành công:', response.data);

            const token = response.data.token;
            console.log(token)
            localStorage.setItem('token', token);
            navigate('/login');

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
            <div className='username-container'>
                <label>Tên đăng nhập:</label>
                <input
                    type="text"
                    value={username}
                    onChange={handleInputUsernameChange}
                    placeholder='Nhập tên người dùng'
                    required />
            </div>

            <div className='email-container'>
                <label>Email:</label>
                <input
                    type="text"
                    value={email}
                    onChange={handleInputEmailChange}
                    placeholder='Nhập email của bạn'
                    required />
            </div>

            <div className="password-container">
                <div className='password'>
                    <label>Mật khẩu:</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Nhập mật khẩu của bạn'
                        required

                    />
                    <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className="toggle-password-icon1"
                        onClick={() => setShowPassword(!showPassword)}
                    />
                </div>


                <div className='confirm-password'>
                    <label>Xác nhận mật khẩu:</label>
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder='Xác thực mật khẩu của bạn'
                        required
                    />
                    <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                        className="toggle-password-icon2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                </div>

            </div>

            <div className='squaredcheck'>
                <label htmlFor="squaredcheck">
                    <input type="checkbox" value="None" id="squaredcheck" className="checkbox" name="check" />
                    <span>Tôi đồng ý với các điều khoản sử dụng.</span>
                </label>
            </div>

            <div className='error-box'>
                {error && <ErrorMessage message={error} />}
            </div>

            <div className='button'>
                <button type="button" onClick={handleSignUp}>Đăng ký</button>
            </div>

            <button className='switch-status-btn' type='button' onClick={() => navigate('/login')}>
                <span>Đã có tài khoản? Đăng nhập ngay!</span>
            </button>
        </div>
    );
};

export default SignUpForm;