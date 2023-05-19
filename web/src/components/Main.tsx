
import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isSigned, Nickname, Sessionid, ProfileImage } from './recoil/atom';
import axios from 'axios';

import Home from './Home'
import Login from './Login/Login';

type Props = {}

const Main = (props: Props) => {
    const setSessionid = useSetRecoilState(Sessionid)
    const setNickname = useSetRecoilState(Nickname)
    const setProfileImage = useSetRecoilState(ProfileImage)
    const [signed, setSigned] = useRecoilState(isSigned)

    const checkLogin = async () => {
        const loggined = localStorage.getItem('how_log')
        if(loggined){ // 로그인 되어있음
            if(loggined === 'kakao'){ // 카카오로그인
                //이미지 가져오가
                console.log("이미지를 가져옵니다")
                setProfileImage(localStorage.getItem('profile_image')!)
            }
            // 닉네임 가져오기 async
            // 세션아이디 가져오기 async
            const sessionid = localStorage.getItem('sessionid')
            const nickname = localStorage.getItem('nickname')

            axios.defaults.headers.common["Authorization"] = sessionid
            setNickname(nickname!)
            setSessionid(sessionid!)
            setSigned(true)
        }
    }

    useEffect(() => {
        checkLogin()
    }, [signed])

  return (
    <>
        {signed ? <Home/> : <Login/>}
    </>
  )
}

export default Main