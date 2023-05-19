import React, { useState } from 'react'
import { IoIosMenu } from 'react-icons/io'
import { IoNavigate, IoLogOutOutline } from 'react-icons/io5'
import Swal from 'sweetalert2'
import { useSetRecoilState } from 'recoil'
import { GetCert, isSigned, Nickname, Sessionid, Userid } from './recoil/atom'
import axios from 'axios'


type Props = {}

const Menu = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const logout = () => {
        Swal.fire({
            title: '로그아웃 하시겠습니까?',
            text: "",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '확인',
            cancelButtonText: '취소',
            reverseButtons: true, // 버튼 순서 거꾸로
        }).then((result) => {
            // 로그아웃하기
            if (result.isConfirmed) {
                const sessionid = localStorage.getItem('sessionid')
                axios.post('/login/logout', {sessionid})
                .then(res => {
                    if(res.status === 200){
                        localStorage.clear()
                        window.location.reload()
                    }
                })
            }
        })
    }


    return (
        <>
        <div className='menu-icon'
        onClick={() => setIsOpen(!isOpen)}
        >
            <IoIosMenu/>
        </div>
        {/* 메뉴 항목들 */}
        {isOpen && <div className={`menu-container`}>
            {/* 로그아웃 */}
            <div className='menu pointer'
            onClick={() => logout()}
            >
                <span>로그아웃</span>
                <IoLogOutOutline fontSize={'2rem'}/>
            </div>
        </div>}
        {/* <div className={`menu-container ${!isOpen ? 'hidden' : ''}`}>
            
            <div className='menu pointer'
            onClick={() => logout()}
            >
                <span>로그아웃</span>
                <IoLogOutOutline fontSize={'2rem'}/>
            </div>
        </div> */}
        </>
    )
}

export default Menu