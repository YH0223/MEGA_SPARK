import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Projects = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchPosts();
    }, [page]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/posts?page=${page}&size=10`);
            setPosts(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('There was an error fetching the posts!', error);
        }
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
        }
    };

    return (
        <div className="container">
            <h1>My Projects</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>{post.title}: {post.content}</li>
                ))}
            </ul>
            <div>
                <button onClick={handlePreviousPage} disabled={page === 0}>
                    Previous
                </button>
                <button onClick={handleNextPage} disabled={page === totalPages - 1}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Projects;