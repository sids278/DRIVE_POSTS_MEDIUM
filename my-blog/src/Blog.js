import React from 'react';

export default function Blog({ post }) {
    return (
        <article
            style={styles.article}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
            <h2 style={styles.title}>{post.title}</h2>
            <p style={styles.content}>{post.content}</p>
            {post.createdAt && (
                <footer style={styles.footer}>
                    <span style={styles.date}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </footer>
            )}
        </article>
    );
}

const baseFont = "'Noto Sans', sans-serif";

const styles = {
    article: {
        fontFamily: baseFont,
        background: 'linear-gradient(145deg, #1a1a1a, #222)',
        padding: '1.8rem',
        marginBottom: '1.8rem',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        border: '1px solid rgba(255,255,255,0.05)',
        color: '#f5f5f5',
    },
    title: {
        margin: 0,
        fontFamily: baseFont,
        color: '#f5f5f5',
        fontSize: '1.6rem',
        fontWeight: 700,
        lineHeight: '1.3',
    },
    content: {
        fontFamily: baseFont,
        color: '#d1d5db',
        fontSize: '1.05rem',
        marginTop: '0.9rem',
        lineHeight: '1.6',
    },
    footer: {
        marginTop: '1.2rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '0.6rem',
    },
    date: {
        fontFamily: baseFont,
        fontSize: '0.9rem',
        color: '#9ca3af',
        fontStyle: 'italic',
    }
};
