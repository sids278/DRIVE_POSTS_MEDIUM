import React, { useState } from 'react';
import axios from 'axios';

export default function BlogPostForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setStatus('Uploading file...');

            let fileId = null;
            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                const uploadRes = await axios.post(
                    'http://localhost:5001/upload',
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );

                fileId = uploadRes.data.fileId;
            }

            setStatus('Creating blog post...');

            const postRes = await axios.post('http://localhost:5001/posts', {
                title,
                content,
                fileId,
            });

            setStatus('✅ Post created successfully!');
            console.log(postRes.data);
        } catch (err) {
            console.error('Error creating post:', err.response?.data || err.message);
            setStatus(`❌ Post creation failed: ${err.response?.data?.error || err.message}`);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.heading}>📝 Create Blog Post</h2>

                <label style={styles.label}>Title</label>
                <input
                    type="text"
                    style={styles.input}
                    placeholder="Enter post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <label style={styles.label}>Content</label>
                <textarea
                    style={styles.textarea}
                    placeholder="Write your post content..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />

                <label style={styles.label}>Attach File (optional)</label>
                <input
                    type="file"
                    style={styles.fileInput}
                    onChange={handleFileChange}
                />

                <button type="submit" style={styles.button}>Publish Post</button>

                {status && <p style={styles.status}>{status}</p>}
            </form>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
    },
    form: {
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px',
        display: 'flex',
        flexDirection: 'column',
    },
    heading: {
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '1.5rem',
        color: '#333',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: '5px',
        marginTop: '15px',
    },
    input: {
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    textarea: {
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        minHeight: '120px',
        resize: 'vertical',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    fileInput: {
        marginTop: '10px',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: '12px',
        marginTop: '20px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    buttonHover: {
        backgroundColor: '#45a049',
    },
    status: {
        marginTop: '15px',
        fontWeight: 'bold',
        color: '#555',
        textAlign: 'center',
    },
};
