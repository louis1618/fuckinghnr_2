import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PostDetail.css'

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <div>로딩 중...</div>;

  return (
    <section className="content">
      <div className="post-detail">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>작성자: {post.author}</span>
          <span>날짜: {post.date}</span>
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