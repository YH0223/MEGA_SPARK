import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const Home = () => {
    const { ref: headingRef, inView: headingInView } = useInView({ triggerOnce: true });
    const { ref: navRef, inView: navInView } = useInView({ triggerOnce: true });

    return (
        <div className="container">
            <h1 ref={headingRef} className={`fade-in ${headingInView ? 'visible' : ''}`}>Welcome to My Portfolio</h1>
            <p>
                This is the home page. Use the navigation links below to see my projects and skills.
            </p>
            <nav ref={navRef} className={`fade-in ${navInView ? 'visible' : ''}`}>
                <ul>
                    <li><Link to="/projects">Projects</Link></li>
                    <li><Link to="/skills">Skills</Link></li>
                    <li><Link to="/insertForm">InsertForm</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default Home;