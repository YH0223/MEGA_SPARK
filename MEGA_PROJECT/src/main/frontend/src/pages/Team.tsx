import React, { useState } from "react";
import { Search, UserPlus, Users } from "lucide-react";
import "./team.css"

const mockUsers = [
  { id: 1, name: "김민수", role: "Frontend Developer", email: "minsu@example.com" },
  { id: 2, name: "이영희", role: "Backend Developer", email: "younghee@example.com" },
  { id: 3, name: "박철수", role: "UI/UX Designer", email: "chulsoo@example.com" },
  { id: 4, name: "최지현", role: "Project Manager", email: "jihyun@example.com" },
];

const TeamManagement = () => {
  const [search, setSearch] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  
  const filteredUsers = mockUsers.filter(
    (user) => user.name.includes(search) || user.role.includes(search)
  );

  const addTeamMember = (user) => {
    if (!teamMembers.find((member) => member.id === user.id)) {
      setTeamMembers([...teamMembers, user]);
    }
  };

  return (
    <div className="team-container p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-xl font-bold mb-4 flex items-center">
        <Users className="mr-2" size={24} /> 팀원 찾기 및 등록
      </h1>
      
      <div className="search-box mb-4 flex items-center border p-2 rounded-lg">
        <Search size={20} className="mr-2" />
        <input
          type="text"
          className="w-full p-2 focus:outline-none"
          placeholder="이름 또는 역할 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="search-results mb-6">
        <h2 className="text-lg font-semibold mb-2">팀원 검색 결과</h2>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center p-2 border-b"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                onClick={() => addTeamMember(user)}
              >
                <UserPlus size={18} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        )}
      </div>

      <div className="team-list">
        <h2 className="text-lg font-semibold mb-2">등록된 팀원</h2>
        {teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex justify-between items-center p-2 border-b"
            >
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">등록된 팀원이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;
