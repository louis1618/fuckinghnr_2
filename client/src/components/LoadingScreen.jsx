import React from 'react';
import '../styles/LoadingScreen.css';
import logo from '../assets/img/logo_background.svg';

function LoadingScreen({ progress }) {
  return (
    <div id="loading">
      <img src={logo} alt="로딩 중" />
      <div id="progress-container">
        <div id="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div id="loading-text">해누리 조지는 중...</div>
    </div>
  );
}

export default LoadingScreen;
