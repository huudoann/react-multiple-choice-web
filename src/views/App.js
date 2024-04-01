import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import AdminLogInForm from '../pages/AdminAuthForm/AdminLoginForm';
import AdminSignUpForm from '../pages/AdminAuthForm/AdminSignUpForm';
import SignUpForm from '../pages/AuthForm/SignUpForm';
import LoginForm from '../pages/AuthForm/LoginForm';
import HomePage from '../pages/HomePage/HomePage';
import DashboardAdmin from '../pages/DashboardAdmin/DashboardAdmin';
import UserManagement from '../pages/DashboardAdmin/UserManagement';
import Statistics from '../pages/DashboardAdmin/Statistics';
import CreateAndEditExams from '../pages/CreateAndEditExams/CreateAndEditExams';
import ExamPage from '../pages/ExamPage/ExamPage';
import ExamResult from '../pages/ExamResult/ExamResult';
import StudentTable from '../pages/StudentTable/StudentTable';
import SearchSection from '../pages/SearchStudentInformations/SearchStudentInformations';
import StudentExamResult from '../pages/StudentExamResult/StudentExamResult';
// import ExamStatistic from '../pages/ExamStatistic/ExamStatistic';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path='/admin-register' element={<AdminSignUpForm />} />
          <Route exact path='/admin-login' element={<AdminLogInForm />} />
          <Route exact path='/' element={<SignUpForm />} />
          <Route exact path='/login' element={<LoginForm />} />
          <Route exact path='/home' element={<HomePage />} />
          <Route exact path='/exam' element={<ExamPage />} />
          <Route exact path='/result' element={<ExamResult />} />
          <Route exact path='/dashboard_admin' element={<DashboardAdmin />} />
          <Route exact path='/user_management' element={<UserManagement />} />
          <Route exact path='/statistics' element={<Statistics />} />
          <Route exact path='/exam/:examId' element={<CreateAndEditExams />} />
          <Route exact path='/student_table' element={<StudentTable />} />
          <Route exact path='/search_student_informations' element={<SearchSection />} />
          <Route exact path='/student_exam_result' element={<StudentExamResult />} />
          {/* <Route exact path='/exam_statistic' element={<ExamStatistic />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
