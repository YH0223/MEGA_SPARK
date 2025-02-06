import React, { useState } from 'react';
import "./Profile.css"

const Profile: React.FC = () => {
    // 상태 정의: 이름, 성, 이메일, 소개, 프로필 이미지
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] = useState<File | null>(null);

    // 폼 제출 시 호출되는 함수
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // 실제 저장 로직(예: API 호출)을 이곳에 추가할 수 있습니다.
        console.log('저장된 프로필 정보:', { firstName, lastName, email, bio, profileImage });
        alert('프로필이 저장되었습니다!');
    };

    // 파일 입력 변경 이벤트 처리 함수
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfileImage(e.target.files[0]);
        }
    };

    return (
        <div className="profile-container">
            <h1>프로필 페이지</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="profileImage">프로필 이미지:</label>
                    <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {profileImage && <p>선택된 이미지: {profileImage.name}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">이름:</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="이름을 입력하세요"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">성:</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="성을 입력하세요"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">이메일:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일을 입력하세요"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="bio">소개:</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="자신을 소개해주세요"
                    />
                </div>
                <button type="submit">프로필 저장</button>
            </form>
        </div>
    );
};

export default Profile;