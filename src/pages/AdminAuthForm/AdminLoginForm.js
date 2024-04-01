import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminAuth.scss';
import { endPoint } from '../../util/api/endPoint.js';
import { Request } from '../../util/axios.js';
import AdminLogIn from './AdminLogIn.js';
import AdminSignUp from './AdminSignUp.js';

const AuthPage = () => {
  const [currentForm, setCurrentForm] = useState('admin-login');
  const [isCloseButton, setIsCloseButton] = useState(false);
  const navigate = useNavigate();


  const switchForm = (formType) => {
    // a viết mẫu 5 phương thức r m tự viết tiếp nhé
    // đầu tiên do cái gọi api là bất đồng bộ nên hàm nào m gọi pahri có async await ví dụ một hàm ntn nhé
    setCurrentForm(formType);
  };

  useEffect(() => {
    // Perform operations when change status
  }, [currentForm]);


  return (
    <div className="auth-page-container">

      {/* Display status AuthForm*/}
      <div className="auth-form-container">

        <div className='form-box'>
          <div className="auth-tabs">
            <button className={currentForm === '/admin-register' ? 'active' : ''} onClick={() => navigate('/admin-register')}>Đăng ký quản trị viên</button>
            <button className={currentForm === 'admin-login' ? 'active' : ''} onClick={() => navigate('/admin-login')}>Đăng nhập quản trị viên</button>
          </div>

          {currentForm === 'admin-login' ? (
            <AdminLogIn switchForm={switchForm} />
          ) : (
            <AdminSignUp switchForm={switchForm} />
          )}
        </div>
      </div>


    </div>
  );
};

export default AuthPage;