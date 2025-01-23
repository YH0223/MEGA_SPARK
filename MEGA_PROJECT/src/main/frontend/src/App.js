import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Admin from './pages/Admin';
import InsertForm from './pages/InsertForm';
import './App.css';

const App = () => {
    const location = useLocation();
    return (
        <TransitionGroup>
            <CSSTransition
                key={location.key}
                timeout={1000} /* 애니메이션 시간을 1000ms로 설정 */
                classNames="fade"
            >
                <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/skills" element={<Skills />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/InsertForm" element={<InsertForm />} />
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
};

const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;