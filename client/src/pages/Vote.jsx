import React from 'react';
import '../styles/Vote.css';

function MainContent() {
  return (
    <section className="content">
      <div className="vote-header">
        <h1>투표</h1>
      </div>
        <div id="vote-container">
            <h1>[진행 중] 허은정 탄핵</h1>
            <h2>누적 동의 수: <span id="vote-count"></span></h2>
            <span>AWS Seoul (ap-northeast-2)</span>
            <button id="vote-button">동의</button>
        </div>
    </section>
  );
}

export default MainContent;
