import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { NavLink } from 'react-router-dom';

const MainContent = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [posts, setPosts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    tags: [],
    rank: '1'
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();

        if (response.status === 500) {
          setPosts([]);
          setErrorMessage(data.message || '권한이 없습니다.');
        } else {
          setPosts(data);
          setErrorMessage('');
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setErrorMessage('서버로부터 데이터를 가져오는 중 오류가 발생했습니다.');
      }
    };

    fetchPosts();
  }, []);

  const sortPosts = (posts) => {
    return posts.sort((a, b) => {
      if (a.rank === '관리자' && b.rank !== '관리자') return -1;
      if (a.rank !== '관리자' && b.rank === '관리자') return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const filteredPosts = activeTab === 'all' 
    ? sortPosts(posts)
    : sortPosts(posts.filter(post => 
        (activeTab === 'admin' && post.rank === '관리자') || 
        (activeTab === 'user' && post.rank === '유저')
  ));

  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prevPost => ({
      ...prevPost,
      [name]: value
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setNewPost(prevPost => ({
      ...prevPost,
      tags: tags
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/rposts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
      });
  
      if (response.status === 201) {
        const updatedPosts = await response.json();
        setPosts(updatedPosts);
        setShowPopup(false);
        setErrorMessage('');
      } else if (response.status === 403) {
        setErrorMessage('포스트를 제출할 권한이 없습니다.');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || '알 수 없는 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage('알 수 없는 오류가 발생했습니다.');
    }
  };  

  return (
    <section className="content">
      <div className="community-header">
        <button className="create-post-button" onClick={() => setShowPopup(true)}>
          포스트 작성
        </button>
      </div>

      {/* 오류 메시지 표시 */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {!errorMessage && (
        <>
          <div className="community-tabs">
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              전체
            </button>
            <button 
              className={`tab ${activeTab === 'user' ? 'active' : ''}`}
              onClick={() => setActiveTab('user')}
            >
              유저
            </button>
            <button 
              className={`tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              관리자
            </button>
          </div>

          <div className="community-posts">
            {filteredPosts && filteredPosts.map(post => (
              <NavLink to={`/posts/view/${post._id}`} key={post._id} className="post-item">
                <div className="post-header">
                  {post.author && <span className="post-author">{post.author}</span>}
                  {post.date && <span className="post-date">{post.date}</span>}
                </div>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-description">{post.description}</p>
                <div className="post-tags">
                  {post.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
                {post.rank && <span className="post-rank">{post.rank}</span>}
              </NavLink>
            ))}
          </div>
        </>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <button className="close-popup" onClick={handlePopupToggle}>×</button>
            <h2>포스트 작성</h2>
            <form onSubmit={handleSubmit}>
              <label>
                제목:
                <input 
                  type="text" 
                  name="title" 
                  value={newPost.title} 
                  onChange={handleInputChange} 
                />
              </label>
              <label>
                내용:
                <textarea 
                  name="description" 
                  value={newPost.description} 
                  onChange={handleInputChange} 
                />
              </label>
              <label>
                태그 (쉼표로 구분):
                <input 
                  type="text" 
                  name="tags" 
                  value={newPost.tags.join(', ')} 
                  onChange={handleTagsChange} 
                />
              </label>
              <button type="submit">포스트 제출</button>
            </form>
            {errorMessage && <p className="error-message2">{errorMessage}</p>}
          </div>
        </div>
      )}
    </section>
  );
};

export default MainContent;
