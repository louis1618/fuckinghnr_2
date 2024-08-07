import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/auth.module.css';
import logo from '../assets/img/logo_model_3.svg';
import { AuthContext } from '../AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message);
    }
  };

  if (isAuthenticated) {
    navigate('/home');
    return null;
  }

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
          <button className={styles.custombutton} type="submit">로그인</button>
        </form>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div className={styles.signupLink}>
          <p>계정이 없으신가요? <a href="/signup">회원가입</a></p>
        </div>
      </div>
    </main>
  );
}

export default Login;