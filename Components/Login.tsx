import { View, Text, SafeAreaView, TouchableOpacity, Platform } from 'react-native'
import React, {useEffect, useState} from 'react'
import { KakaoOAuthToken, login, logout, getProfile, KakaoProfile, unlink, getAccessToken } from '@react-native-seoul/kakao-login'
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication'
import jwtDecode from 'jwt-decode'

type Props = {}



const Login = (props: Props) => {
    const [result, setResult] = useState<any>('')

    /**
     * Apple 로그인
     */
    async function onAppleButtonPress() {
        // performs login request
        const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // Note: it appears putting FULL_NAME first is important, see issue #293
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
    
      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
    
      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
        const decoded = jwtDecode(appleAuthRequestResponse.identityToken!)
        // const decoded = appleAuthRequestResponse
        // const decoded = jwtDecode(appleAuthRequestResponse.user!)
        if(decoded){
            setResult(JSON.stringify(decoded))
        }
            
      }
    }
    /**
     * 카카오 로그인
     */
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

    const gettoken = async (): Promise<void> => {
        const token: any = await getAccessToken()
            setResult(JSON.stringify(token))
        }
    
    const unlinkKakao = async (): Promise<void> => {
        const message = await unlink();
    
        setResult(message);
    }


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

        <TouchableOpacity
        onPress={() => {
            gettoken()
        }}>
            <Text>카카오 token</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && 
        <AppleButton 
        buttonStyle={AppleButton.Style.WHITE}
        buttonType={AppleButton.Type.SIGN_IN}
        style={{
            width: 160, // You must specify a width
            height: 45, // You must specify a height
        }}
         onPress={() => onAppleButtonPress()}/>}
       
        <Text>{result}</Text>
        </SafeAreaView>
    )
}

export default Login