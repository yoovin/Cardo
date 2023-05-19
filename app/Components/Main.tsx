
import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {View} from 'react-native'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isSigned, Nickname, Sessionid, ProfileImage } from './recoil/atom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile, KakaoProfile } from '@react-native-seoul/kakao-login'

import Home from './Home'
import Login from './Login';
import axios from 'axios';

type Props = {}

const Main = (props: Props) => {
    const setSessionid = useSetRecoilState(Sessionid)
    const setNickname = useSetRecoilState(Nickname)
    const setProfileImage = useSetRecoilState(ProfileImage)
    const [signed, setSigned] = useRecoilState(isSigned)

    const checkLogin = async () => {
        const loggined = await AsyncStorage.getItem('how_log')
        if(loggined){ // 로그인 되어있음
            if(loggined === 'kakao'){ // 카카오로그인
                //이미지 가져오가
                console.log("이미지를 가져옵니다")
                const profile: KakaoProfile = await getProfile()
                setProfileImage(profile.profileImageUrl)
            }
            // 닉네임 가져오기 async
            // 세션아이디 가져오기 async
            const sessionid = await AsyncStorage.getItem('sessionid')
            const nickname = await AsyncStorage.getItem('nickname')

            axios.defaults.headers.common["Authorization"]  = sessionid
            setNickname(nickname!)
            setSessionid(sessionid!)
            setSigned(true)
        }
    }

    useEffect(() => {
        console.log("signed 체크됨")
        checkLogin()
    }, [signed])

  return (
    <>
        {signed ? <Home/> : <Login/>}
    </>
  )
}

export default Main