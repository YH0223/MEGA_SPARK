import React, { useState, useEffect } from "react";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
            const response = await api.get("/user/profile");
            setUserName(response.data.userName);
            setEmail(response.data.email_address);
            setProfileImageUrl(`${response.data.img_url}`);
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
            const response = await api.post("/user/saveProfile", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setProfileImageUrl(`${response.data.img_url}`);
            toast.success("✅ 프로필이 설정되었습니다!", {
                position: "top-center",
                autoClose: 1300,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                icon: false,
                style: { maxWidth: "250px" }, // ✅ 고정된 가로 크기
            });

            fetchProfile();
        } catch (error) {
            console.error("❌ 프로필 저장 실패:", error);
            if (error && (error as any).response) {
                toast.error(`❌ 프로필 저장 실패: ${(error as any).response.data}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            } else {
                toast.error("❌ 프로필 저장 실패", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                });

            }
        }
    };

    return (
        <div className="profile-container">
            <ToastContainer /> {/* ✅ 토스트 컨테이너 추가 */}
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

                    {/* ✅ 이미지 미리보기 */}
                    {profileImageUrl && (
                        <div className="profile-preview-container">
                            <img src={profileImageUrl} alt="프로필" className="profile-preview" />
                        </div>
                    )}
                </div>

                <button type="submit">프로필 저장</button>
            </form>

        </div>
    );
};

export default Profile;
