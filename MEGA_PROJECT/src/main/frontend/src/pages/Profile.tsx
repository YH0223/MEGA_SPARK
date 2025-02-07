import React, { useState, useEffect } from "react";
import api from "../api";
import "./Profile.css";

const Profile = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/api/user/profile");
            setUserName(response.data.userName);
            setEmail(response.data.email_address);
            setProfileImageUrl(`http://localhost:8080${response.data.img_url}`);
        } catch (error) {
            console.error("🚨 프로필 불러오기 실패:", error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setProfileImage(file);

            // 새로 선택한 이미지 미리보기
            const imageUrl = URL.createObjectURL(file);
            setProfileImageUrl(imageUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("userName", userName);
        formData.append("email", email);
        if (profileImage) {
            formData.append("profileImage", profileImage);
        }

        try {
            const response = await api.post("/api/user/saveProfile", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setProfileImageUrl(`http://localhost:8080${response.data.img_url}`);
            alert("✅ 프로필이 저장되었습니다.");
            fetchProfile();
        } catch (error) {
            console.error("❌ 프로필 저장 실패:", error);
            alert("❌ 프로필 저장 중 오류 발생");
        }
    };

    return (
        <div className="profile-container">
            <h1>프로필 페이지</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>이름:</label>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>이메일:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>프로필 이미지:</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {profileImageUrl && <img src={profileImageUrl} alt="프로필" className="profile-preview" />}
                </div>
                <button type="submit">프로필 저장</button>
            </form>
        </div>
    );
};

export default Profile;
