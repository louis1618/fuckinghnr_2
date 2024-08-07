import React, { useState, useContext } from 'react';
import '../styles/Header.css';
import logo from '../assets/img/logo_background.svg'
import avator from '../assets/img/user-avatar.svg' 
import { AuthContext } from '../AuthContext';

function Header() {
  const { user, isAuthenticated} = useContext(AuthContext);

  return (
    <header>
      <div className="logo">
        <a href="/home"><img src={logo} alt="Jokga School Alpha" className="logo_img" /></a>
      </div>
      <div className="user-info">
        <i className="fa-solid fa-bell fa-lg" style={{color: "#ffffff",}}></i>
        <img src={avator} alt="사용자 아바타" />
        {isAuthenticated && <span id="username">{user.username}</span>}
      </div>
    </header>
  );
}

export default Header;
