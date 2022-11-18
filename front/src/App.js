import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import Home from './Components/Home';
import Nav from './Components/Navbar/Navbar';
import Login from './Components/Users/Login';
import { Routes, Route } from 'react-router-dom';
import Register from './Components/Users/Register';
import Profile from './Components/Users/Profile';
import ResetPassword from './Components/Users/ResetPassword';
import ManageUsers from './Components/Users/ManageUsers';
import AddUser from './Components/Users/AddUser';
import ManageCompanies from './Components/Companies/ManageCompanies';
import AddCompany from './Components/Companies/AddCompany';
import AddApply from './Components/Applies/AddApply';
import AddJob from './Components/Jobs/AddJob';
import ManageJobs from './Components/Jobs/ManageJobs';
import ManageApplies from './Components/Applies/ManageApplies';

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/all-users' element={<ManageUsers />} />
        <Route path='/all-companies' element={<ManageCompanies />} />
        <Route path='/all-jobs' element={<ManageJobs />} />
        <Route path='/all-applies' element={<ManageApplies />} />
        <Route path='/create-user' element={<AddUser />} />
        <Route path='/create-company' element={<AddCompany />} />
        <Route path='/create-apply' element={<AddApply />} />
        <Route path='/create-job' element={<AddJob />} />
      </Routes>
    </>
  );
}

export default App;
