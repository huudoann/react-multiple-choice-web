import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import SignUpForm from '../pages/AuthForm/SignUpForm';
import LoginForm from '../pages/AuthForm/LoginForm';
import HomePage from '../pages/HomePage/HomePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path='/' element={<SignUpForm />} />
          <Route exact path='/login' element={<LoginForm />} />
          <Route exact path='/home' element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
