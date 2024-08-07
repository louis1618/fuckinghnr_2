import React from 'react';
import '../styles/Home.css';

function MainContent({ username }) {
  return (
    <section className="content">
      <div className="home-header">
        <h1>환영합니다!</h1>
      </div>
      <div className="game-section">
        <div className="section-header">
          <h2>공지사항</h2>
          <a href="/home" className="create-button">관리</a>
        </div>
        <div className="game-grid">
          <div className="game-card">
            <h3>허은정 탄핵</h3>
            <p>상태: 진행 중</p>
            <p>누적 동의 수 : 0</p>
          </div>
        </div>
      </div>
      <div className="video-section">
        <div className="section-header">
          <h2>하이라이트 게시물</h2>
          <a href="#home" className="create-button">관리</a>
        </div>
        <div className="video-grid">
          <div className="video-card">
            <h3>Jokga School Alpha</h3>
            <p>dev...</p>
          </div>
          {/* 추가 비디오 카드들... */}
        </div>
      </div>
    </section>
  );
}

export default MainContent;
