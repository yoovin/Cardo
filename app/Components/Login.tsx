import { View, Text, SafeAreaView, TouchableOpacity, Platform, Image, Animated, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
import { KakaoOAuthToken, login, logout, getProfile, KakaoProfile, unlink, getAccessToken } from '@react-native-seoul/kakao-login'
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication'
import jwtDecode from 'jwt-decode'
import LinearGradient from 'react-native-linear-gradient'
import styles from '../styles'
import { useSetRecoilState } from 'recoil'
import { isSigned, Nickname, Sessionid } from './recoil/atom'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

type Props = {}



const Login = (props: Props) => {
    
    const setSessionid = useSetRecoilState(Sessionid)
    const setNickname = useSetRecoilState(Nickname)
    const setSigned = useSetRecoilState(isSigned)

    // 애니메이션 선언
    const [animations] = useState(Array.from({length: 6},  () => new Animated.Value(0)))
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
        const decoded = appleAuthRequestResponse
        if(decoded){
            // setResult(JSON.stringify(decoded))
            console.log(JSON.stringify(decoded))
            AsyncStorage.setItem('how_log', 'apple')
            .then(() => {
                Login(decoded.user)
                console.log('로그인 정보 저장 됨')
            })
            .catch(err => Alert.alert(`문제가 발생했습니다. ${err}`))
        }else{
            Alert.alert("로그인 문제가 발생했습니다.")
        }
      }
    }
    /**
     * 카카오 로그인
     */
    const signInWithKakao = async (): Promise<void> => {
        const token: KakaoOAuthToken = await login();
        const profile: KakaoProfile = await getProfile();
            if(token){
                console.log(profile)
                AsyncStorage.setItem('how_log', 'kakao')
                .then(() => {
                    Login(profile.id)
                    // console.log()
                    console.log('로그인 정보 저장 됨')
                })
                .catch(err => Alert.alert(`문제가 발생했습니다. ${err}`))
            }else{
                Alert.alert("로그인 문제가 발생했습니다.")
            }
        }

    /**
     * 
     * @param userid 
     * 각 소셜로그인으로 받아 온 아이디로 로그인함
     */
    const Login = async (userid: string) => {
        axios.post('/login', {userid}, {validateStatus: (status) => (status < 500)})
        .then(async res => {
            if(res.status === 200){
                await AsyncStorage.setItem('nickname', res.data.nickname)
                await AsyncStorage.setItem('sessionid', res.data.sessionid)
                setNickname(res.data.nickname)
                setSessionid(res.data.sessionid)
                setSigned(true)
            }else if(res.status === 404){
                Alert.prompt("이름을 알려주세요.", "나중에 변경 가능해요.", [
                    {
                        text: '완료',
                        onPress: (nickname) => {
                            if(nickname){
                                signup(userid, nickname)
                            }else{
                                Alert.alert("이름은 1자이상 지정해야합니다.", "다시 시도해주세요.")
                            }
                        }
                    }
                ],'plain-text')
            }
        })
        .catch(err => Alert.alert(`${err}`))
    }

    /**
     * 
     * @param userid 
     * @param nickname 
     * 로그인이 처음 일 경우 회원가입
     */
    const signup = async(userid: string, nickname: string) => {
        axios.post('/login/signup', {
            userid,
            nickname
        })
        .then(async res => {
            await AsyncStorage.setItem('nickname', res.data.nickname)
            await AsyncStorage.setItem('sessionid', res.data.sessionid)

            setNickname(res.data.nickname)
            setSessionid(res.data.sessionid)
            setSigned(true)
        })
        .catch(err => Alert.alert(`${err}`))
    }

    /**
     * 동작할 애니메이션 Top 위치값
     */
    const aniPositions = animations.map(item => (item.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
        })))

    /**
     * 동작할 애니메이션 투명도값
     */
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
        Animated.sequence(
            animations.map(ani => moveAni(ani))
        ).start()
    }, [])

    return (
        <LinearGradient colors={['#f69744', '#e9445d']} style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
                <View style={{flex: 1, padding: '10%'}}>
                <Animated.Text style={[styles.text2xl, styles.fontBold, {top: aniPositions[0], marginBottom: 10, color: 'white', opacity: aniOpacitys[0]}]}>반가워요!</Animated.Text>
                    <Animated.Text style={[styles.text2xl, styles.fontBold, {top: aniPositions[1], marginBottom: 10, color: 'white', opacity: aniOpacitys[1]}]}>카두를 이용하려면</Animated.Text>
                    <Animated.Text style={[styles.text2xl, styles.fontBold, {top: aniPositions[2], marginBottom: 10, color: 'white', opacity: aniOpacitys[2]}]}>아래를 눌러</Animated.Text>
                    <Animated.Text style={[styles.text2xl, styles.fontBold, {top: aniPositions[3], marginBottom: 10, color: 'white', opacity: aniOpacitys[3]}]}>로그인 해주세요.</Animated.Text>
                </View>

                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Animated.View style={{top: aniPositions[4], opacity: aniOpacitys[4]}}>
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
                    <Animated.View style={{top: aniPositions[5], opacity: aniOpacitys[5]}}>
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
            </SafeAreaView>
        </LinearGradient>
    )
}

export default Login