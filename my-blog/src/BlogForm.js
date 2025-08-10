import React, { useState } from 'react';

function BlogForm({ onAddPost }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && content) {
      onAddPost(title, content);
      setTitle('');
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
      <h2>Create a New Post</h2>
      <input
        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        rows="5"
        placeholder="Write your post here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit" style={{ padding: '0.5rem 1rem', background: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}>
        Post
      </button>
    </form>
  );
}

export default BlogForm;
