import React from 'react';
import '@/styles/userPage.css'

const UserNavbar = () => {
    return (
        <div className="user__left">
            <div className="user__action">
                <div className="user__action-list">
                    <p><i className="fa-solid fa-user"></i>Hồ Sơ</p>
                    <p><i className="fa-solid fa-bell"></i>Thông Báo</p>
                    <p><i className="fa-regular fa-note-sticky"></i>Bài Đăng</p>
                    <p><i className="fa-solid fa-heart"></i>Yêu Thích</p>
                    <p><i className="fa-solid fa-list"></i>Danh Sách Đã Lưu</p>
                </div>
            </div>
        </div>
    );
};

export default UserNavbar;