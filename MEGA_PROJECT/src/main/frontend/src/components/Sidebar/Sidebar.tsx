import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">

      <h1> PMS </h1>
      <h2>Dashboard</h2>
      <ul>
        <li>Dashboard</li>
        <li>Projects</li>
        <li>Team</li>
        <li>Calendar</li>
        <li>Promote</li>
        <li>Help</li>
      </ul>
    </div>
  );
};

export default Sidebar;