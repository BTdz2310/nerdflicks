'use client'
import React from 'react';
import '@/styles/userPage.css'
import {Link} from "next-view-transitions";
import {usePathname} from "next/navigation";
import {useSelector} from "react-redux";
import {selectId} from "@/store/features/userSlice/userSlice";

const UserNavbar = ({id}: {id: string}) => {

    const pathname = usePathname();
    const selectedId = useSelector(selectId);

    return (
        <div className="user__left">
            <div className="user__action">
                <div className="user__action-list">
                    <Link href={`/user/profile/${pathname.split('/')[pathname.split('/').length-1]}`} className={pathname.includes('profile')?'user__link-selected':undefined}><p><i className="fa-solid fa-user"></i>Hồ Sơ</p></Link>
                    {selectedId===id?<Link href={`/user/notification/${pathname.split('/')[pathname.split('/').length-1]}`} className={pathname.includes('notification')?'user__link-selected':undefined}><p><i className="fa-solid fa-bell"></i>Thông Báo</p></Link>:undefined}
                    <Link href={`/user/post/${pathname.split('/')[pathname.split('/').length-1]}`} className={pathname.includes('post')?'user__link-selected':undefined}><p><i className="fa-regular fa-note-sticky"></i>Bài Đăng</p></Link>
                    {selectedId===id?<Link href={`/user/favorite/${pathname.split('/')[pathname.split('/').length-1]}`} className={pathname.includes('favorite')?'user__link-selected':undefined}><p><i className="fa-solid fa-heart"></i>Yêu Thích</p></Link>:undefined}
                    {selectedId===id?<Link href={`/user/list/${pathname.split('/')[pathname.split('/').length-1]}`} className={pathname.includes('list')?'user__link-selected':undefined}><p><i className="fa-solid fa-list"></i>Danh Sách Đã Lưu</p></Link>:undefined}
                </div>
            </div>
        </div>
    );
};

export default UserNavbar;