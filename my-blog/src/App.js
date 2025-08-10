import React from "react";
import BlogPostForm from "./BolgPostForm";
import BlogList from "./BlogList";

function App() {
  const [showForm, setShowForm] = React.useState(false);
  return (
    <div>
      <h1>Sid's personal blogs</h1>
      <button
        style={{
          background: '#4CAF50', color: '#fff', padding: '12px 24px', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', marginBottom: '1.5rem', marginTop: '1rem', transition: 'background 0.2s',
        }}
        onClick={() => setShowForm((v) => !v)}
      >
        {showForm ? 'Close Post Form' : 'Create New Post'}
      </button>
      {showForm && <BlogPostForm />}
      <hr style={{ margin: '2rem 0' }} />
      <BlogList />
    </div>
  );
}

export default App;
