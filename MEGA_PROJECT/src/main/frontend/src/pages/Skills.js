import React from 'react';
import { useInView } from 'react-intersection-observer';

const Skills = () => {
    const { ref: listRef, inView: listInView } = useInView({ triggerOnce: true });

    return (
        <div className="container">
            <h1>My Skills</h1>
            <ul ref={listRef} className={`fade-in ${listInView ? 'visible' : ''}`}>
                <li>JavaScript</li>
                <li>React</li>
                <li>Node.js</li>
                <li>Java</li>
                <li>Spring Boot</li>
                <li>HTML & CSS</li>
            </ul>
        </div>
    );
};

export default Skills;