import React from 'react';
import './ProjectCard.css';

interface ProjectCardProps {
  projectName: string;
  projectManager: string;
  className: string;
  email: string;
  status: string;
  period: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectName,
  projectManager,
  className,
  email,
  status,
  period,
}) => {
  return (
    <div className="project-card">
      <table className="project-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Project Manager</th>
            <th>Class</th>
            <th>Email</th>
            <th>Status</th>
            <th>Period</th>
          </tr> 
        </thead>
        <tbody>
          <tr>
            <td>{projectName}</td>
            <td>{projectManager}</td>
            <td>{className}</td>
            <td>{email}</td>
            <td>{status}</td>
            <td>{period}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProjectCard;