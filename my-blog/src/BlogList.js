import React, { useEffect, useState } from 'react';
import Blog from './Blog';

function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:5001/posts');
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(data.posts || data); // support both {posts:[]} and []
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  console.log(posts);
  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{color: 'red'}}>Error: {error}</p>;

  return (
    <div>
      {posts.length === 0 ? (
        <p>No posts yet. Create one!</p>
      ) : (
        posts.map((post, index) => (
          <Blog key={post._id || index} post={post} />
        ))
      )}
    </div>
  );
}

export default BlogList;
