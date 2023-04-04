import { View, Text, SafeAreaView, TouchableOpacity, Platform, Image, Animated } from 'react-native'
import React, {useEffect, useState} from 'react'
import { KakaoOAuthToken, login, logout, getProfile, KakaoProfile, unlink, getAccessToken } from '@react-native-seoul/kakao-login'
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication'
import jwtDecode from 'jwt-decode'
import LinearGradient from 'react-native-linear-gradient'
import styles from '../styles'

type Props = {}



const Login = (props: Props) => {
    const [result, setResult] = useState<any>('')
    const [animations] = useState([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0)
    ]);

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
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user)
    
      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
        // const decoded = jwtDecode(appleAuthRequestResponse.identityToken!)
        const decoded = appleAuthRequestResponse
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

    const checkLogin = async () => {
        // const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user)
    }

    const aniPositions = animations.map(item => (item.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
        })))

    const aniOpacitys = animations.map(item => (item.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        })))

    const moveAni = (animation: any): any => {
        return Animated.timing(animation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
        })
    }

    useEffect(() => {
        console.log(result)
    }, [result])
    
    useEffect(() => {
        Animated.sequence(
            animations.map(ani => moveAni(ani))
        ).start()
    }, [])

    return (
        <LinearGradient colors={['#f69744', '#e9445d']} style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
            {/* <Text>Login</Text>
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
            </TouchableOpacity> */}
            
            <View style={{flex: 1, padding: '10%'}}>
                <Animated.Text style={[styles.text2xl, styles.fontBold, {top: aniPositions[0], marginBottom: 10, color: 'white', opacity: aniOpacitys[0]}]}>투두를 이용하려면</Animated.Text>
                <Animated.Text style={[styles.text2xl, styles.fontBold, {top: aniPositions[1], marginBottom: 10, color: 'white', opacity: aniOpacitys[1]}]}>아래를 눌러</Animated.Text>
                <Animated.Text style={[styles.text2xl, styles.fontBold, {top: aniPositions[2], marginBottom: 10, color: 'white', opacity: aniOpacitys[2]}]}>로그인 해주세요.</Animated.Text>
            </View>

            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Animated.View style={{top: aniPositions[3], opacity: aniOpacitys[3]}}>
                    <TouchableOpacity
                    style={{width: 183, height: 45, marginBottom: 20}}
                    onPress={() => {
                        signInWithKakao()
                    }}
                    activeOpacity={0.5}>
                        <Image source={require('../assets/images/kakao_login.png')}/>
                    </TouchableOpacity>
                </Animated.View>

                {Platform.OS === 'ios' && 
                <Animated.View style={{top: aniPositions[4], opacity: aniOpacitys[4]}}>
                    <AppleButton 
                    buttonStyle={AppleButton.Style.WHITE}
                    buttonType={AppleButton.Type.SIGN_IN}
                    style={{
                        width: 183, // You must specify a width
                        height: 45, // You must specify a height
                    }}
                    onPress={() => onAppleButtonPress()}/>
                </Animated.View>}
                
            </View>
            <Text>{result}</Text>
            </SafeAreaView>
        </LinearGradient>
    )
}

export default Login