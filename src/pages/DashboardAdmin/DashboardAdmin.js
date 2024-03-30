import React, { useState } from 'react';
import './DashboardAdmin.scss';
import ExamManager from './ExamManager';
import UserManagement from './UserManagement';
import Statistics from './Statistics';
import { Link } from 'react-router-dom';


const DashboardAdmin = () => {
    const [currentPage, setCurrentPage] = useState('exam');

    const navigate = (page) => {
        setCurrentPage(page);
    };
// em làm ở folder này oke
    return (
        <div className='dashboard_admin'>
            <div className='auth-tabs'>
                <button className={`inline-heading ${currentPage === 'exam' ? 'active' : ''}`} onClick={() => navigate('exam')}>Quản lý danh sách kỳ thi</button>
                <button className={`inline-heading ${currentPage === 'user_management' ? 'active' : ''}`} onClick={() => navigate('user_management')}>Quản lý người dùng</button>
                <button className={`inline-heading ${currentPage === 'statistics' ? 'active' : ''}`} onClick={() => navigate('statistics')}>Thống kê</button>
            </div>
            {currentPage === 'exam' && <ExamManager />}
            {currentPage === 'user_management' && <UserManagement />}
            {currentPage === 'statistics' && <Statistics />}
        </div>
    );
}

export default DashboardAdmin;
