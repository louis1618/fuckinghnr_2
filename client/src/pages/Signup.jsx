import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/auth.module.css';
import logo from '../assets/img/logo_model_3.svg';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordCheck) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <main>
      <div className={styles.container}>
        <div className={styles.header2}>
          <div className={styles.logo}>
            <img src={logo} alt="Jokga School Alpha" className={styles.logo_img} />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">아이디:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="password_check">비밀번호 확인:</label>
          <input
            type="password"
            id="password_check"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            required
          />

          <button className={styles.custombutton} type="submit">회원가입</button>
        </form>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <div className={styles.signupLink}>
          <p>계정이 있으신가요? <a href="/login">로그인</a></p>
        </div>
      </div>
    </main>
  );
}

export default Signup;