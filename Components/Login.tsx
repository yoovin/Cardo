import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import { KakaoOAuthToken, login, logout, getProfile, KakaoProfile, unlink } from '@react-native-seoul/kakao-login'

type Props = {}

const Login = (props: Props) => {
    const [result, setResult] = useState('')

    const signInWithKakao = async (): Promise<void> => {
        const token: KakaoOAuthToken = await login();
      
        setResult(JSON.stringify(token));
      };
      
      const signOutWithKakao = async (): Promise<void> => {
        const message = await logout();
      
        setResult(message);
      };
      
      const getKakaoProfile = async (): Promise<void> => {
        const profile: KakaoProfile = await getProfile();
      
        setResult(JSON.stringify(profile));
      };
      
      const unlinkKakao = async (): Promise<void> => {
        const message = await unlink();
      
        setResult(message);
      };

      useEffect(() => {
        console.log(result)
      }, [result])


    return (
        <SafeAreaView>
        <Text>Login</Text>
        <TouchableOpacity
        onPress={() => {
            signInWithKakao()
        }}>
            <Text>카카오 로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={() => {
            signOutWithKakao()
        }}>
            <Text>카카오 로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={() => {
            getKakaoProfile()
        }}>
            <Text>카카오 프로필</Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={() => {
            unlinkKakao()
        }}>
            <Text>카카오 언링크</Text>
        </TouchableOpacity>
        <Text>{result}</Text>
        </SafeAreaView>
    )
}

export default Login