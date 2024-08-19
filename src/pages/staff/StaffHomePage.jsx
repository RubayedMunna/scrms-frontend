import { Navbar, Nav, Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faEye } from '@fortawesome/free-solid-svg-icons';
import '../../App.css'
import StaffDashboard from '../../components/staff/StaffDashboard'
import StaffNavbar from '../../components/staff/StaffNavbar';


function TeacherHomePage() {
  return (
    <div>
        <StaffNavbar/>
        <StaffDashboard/>
    </div>
  )
}

export default TeacherHomePage;