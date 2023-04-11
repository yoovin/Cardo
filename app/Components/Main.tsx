
import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {View} from 'react-native'
import { RecoilRoot, useRecoilState } from 'recoil'
import { isSigned, currentUserid, currentUsername, currentUserImageUri } from './recoil/atom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile, KakaoProfile } from '@react-native-seoul/kakao-login'

import Home from './Home'
import Login from './Login';

type Props = {}

const Main = (props: Props) => {
    const [signed, setSigned] = useRecoilState(isSigned)

    /**
     * 카카오 프로필 가져오기
     */
    const getKakaoProfile = async (): Promise<void> => {
        const profile: KakaoProfile = await getProfile();
        
    }

    const checkLogin = async () => {
        const loggined = await AsyncStorage.getItem('how_log')
        if(loggined){ // 로그인 되어있음
            if(loggined === 'kakao'){ // 카카오로그인
                //이미지 가져오가
            }
            // 닉네임 가져오기 async
            // 세션아이디 가져오기 async
            setSigned(true)
        }
    }

    useEffect(() => {
        checkLogin()
    }, [])

  return (
    <>
        {signed ? <Home/> : <Login/>}
    </>
  )
}

export default Main