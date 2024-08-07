import React from 'react';
import '../styles/Vote.css';
import logo from '../assets/img/logo_background.svg'

function MainContent() {
  return (
    <section className="content">
    <img src={logo} alt="Jokga School Alpha" className="logo_img"></img>
    <h1>404 | 페이지를 찾을 수 없습니다</h1>
    <button><a href="/home">홈으로 가기</a></button>
    </section>
  );
}

export default MainContent;
