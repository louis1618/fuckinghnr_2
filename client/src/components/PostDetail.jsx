import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PostDetail.css'

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          throw new Error('Post not found');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError('포스트를 불러올 수 없습니다');
      }
    };

    fetchPost();
  }, [id]);

  if (error) {
    return (
      <section className="content">
        <div className="prs-message">{error}</div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="content">
        <div className="prs-message">로딩 중...</div>
      </section>
    );
  }

  return (
    <section className="content">
      <div className="post-detail">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>작성자: {post.author} 날짜: {post.date}</span>
        </div>
        <p>{post.description}</p>
        <div className="post-tags">
          {post.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PostDetail;