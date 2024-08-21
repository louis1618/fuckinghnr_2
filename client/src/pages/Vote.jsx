import React from 'react';
import '../styles/Vote.css';

function MainContent() {
  return (
    <section className="content">
      <div className="notice-section">
        <div className="section-header">
          <h2>진행중인 투표</h2>
        </div>
        <div className="item-grid">
          <div className="item-card">
            <h3>[허은정] 탄핵 요구</h3>
            <p>누적 집계수: 0</p>
          </div>
        </div>
      </div>

      <div className="recent-posts-section">
        <div className="section-header">
          <h2>하이라이트</h2>
        </div>
        <div className="item-grid">
          <div className="item-card">
            <h3>나가 뒤져</h3>
            <p></p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MainContent;
