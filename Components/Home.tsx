import { View, Text, SafeAreaView, ScrollView, Dimensions, Animated, PanResponder, TouchableOpacity, Image } from 'react-native'
import React, {useState, useRef, useEffect} from 'react'
import styles from '../styles'
import LinearGradient from 'react-native-linear-gradient'
import TodoCard from './TodoCard'
import Topbar from './Topbar';

import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {RFPercentage} from "react-native-responsive-fontsize"
import { KakaoOAuthToken, login, logout, getProfile, KakaoProfile, unlink } from '@react-native-seoul/kakao-login'

import { useRecoilState } from 'recoil'
import { isAddTaskFullScreen } from './recoil/atom' 

const { width, height } = Dimensions.get('window');

const day = ['일', '월', '화', '수', '목', '금', '토']

// 더미
const Todos = [
    {
        id: 1,
        userid: 'yoo',
        icon: '',
        title: 'Personal',
        todos: [],
        color: ['#f69744', '#e9445d']
    },
    {
        id: 2,
        userid: 'yoo',
        icon: '',
        title: 'Work',
        todos: [],
        color: ['#5297e1', '#4048df']
    },
    {
        id: 3,
        userid: 'yoo',
        icon: '',
        title: 'Home',
        todos: [],
        color: ['#78b93c', '#118675']
    }
]

type Props = {}

/**
 * ===== TODOS =====
 * ㅇ. 색 바뀌는것도 애니메이션으로 만들어보기
 * ㅇ. 지금은 카드가 전부 다 커지는데 하나씩만 커지게 고쳐보기
 */

const Home = (props: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const scrollViewRef = useRef(null)
    const [onFullscreen, setOnFullscreen] = useState(false)
    const [isaddTaskFullScreen, setIsaddTaskFullScreen] = useRecoilState(isAddTaskFullScreen)
    const [currentBackgroundColor, setCurrentBackgroundColor] = useState(['#f69744', '#e9445d'])
    const [animation] = useState(new Animated.Value(0))
    // const [colorAnimation] = useState(new Animated.Value(0))

    const [nickname, setNickname] = useState('')
    const [profileImage, setProfileImage] = useState('')

    /**
     * 카카오 프로필 가져오기
     */
    const getKakaoProfile = async (): Promise<void> => {
        const profile: KakaoProfile = await getProfile();
      
        setNickname(profile.nickname)
        setProfileImage(profile.thumbnailImageUrl)
      };

    /**
     * 
     * @param date
     * @returns 한글로 바뀐 날짜 출력
     */
    const dateToString = (date: Date) => {
        let strDate = `${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일 ${day[date.getDay()]}요일`
        return strDate
        
    }

    const leftButton = () => {
        if(onFullscreen){
            if(isaddTaskFullScreen){
                return(
                    <TouchableOpacity onPress={() => {
                        setIsaddTaskFullScreen(false)
                    }}>
                        <Ionicons name="close" size={RFPercentage(3)} color='#9a9a9a'></Ionicons>
                    </TouchableOpacity>)
            }else{
                return(
                <TouchableOpacity onPress={() => {
                    setOnFullscreen(false)
                }}>
                    <AntDesign name="arrowleft" size={RFPercentage(3)} color='#9a9a9a'></AntDesign>
                </TouchableOpacity>)
            }            
        }else{
            return(
            <TouchableOpacity onPress={() => {
            }}>
                <Ionicons name="ios-menu" size={RFPercentage(3)} color='white'></Ionicons>
            </TouchableOpacity>)
        }
            
            
    }

    const rightButton = onFullscreen 
    ? <TouchableOpacity onPress={() => {
        
    }}>
        <Ionicons name="ellipsis-vertical" size={RFPercentage(3)} color='#9a9a9a'></Ionicons>
    </TouchableOpacity>
    : <TouchableOpacity onPress={() => {
        
    }}>
        <Ionicons name="ellipsis-vertical" size={RFPercentage(3)} color='white'></Ionicons>
    </TouchableOpacity>

    /*
    ===== animation value =====
    */
    const aniTop = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['40%', '0%']
    })

    const aniHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['50%', '100%']
    })

    const cardWidth = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [width * 0.8, width]
    })

    const cardMargin = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [width * 0.1, 0]
    })

    const todoListOpacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    })

    const todoListHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '80%']
    })

    // let color = colorAnimation.interpolate({
    //     inputRange: [0, 1],
    // })

    /**
     * 풀 스크린 애니메이션
     */
    const animateIn = () => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start()
    }

    /**
     * 풀 스크린 해제 애니메이션
     */
    const animateOut = () => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start()
    }

    /**
     * 전체화면으로 바꿈
     */
    const switchFullscreen = () => {
        setOnFullscreen(true)
    }

    const switchSmallscreen = () => {
        setOnFullscreen(false)
    }

    /**
     *  카드 ScrollView 이동 시 동작하는 함수
     * @param event ScrollView 이벤트
     */
    const handleCardIndex = (event: any) => {
        const { contentOffset } = event.nativeEvent;
        const index = Math.round(contentOffset.x / width);
        setCurrentIndex(index)
        setCurrentBackgroundColor(Todos[index].color)
    }

    
    /*
    ===== gesture =====
    */
   
   const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
               // 사용자가 화면을 터치했을 때 제스처를 인식하도록 설정
                return true;
            },
            onPanResponderMove: (evt, gestureState) => {
                // 사용자가 손가락을 위로 움직였을 때 실행되는 콜백 함수
                if (gestureState.dy < -70 && !onFullscreen ) {
                    // 사용자가 손가락을 위로 70픽셀 이상 움직였을 때 실행할 로직
                    switchFullscreen()
                }else if(gestureState.dy > 70) {
                    // 사용자가 손가락을 아래로 70픽셀 이상 움직였을 때 실행할 로직
                    switchSmallscreen()
                }
                
                
            },
        })
        ).current;
        
        useEffect(() => {
            if(onFullscreen){
                animateIn()
            }else{
                animateOut()
            }
        }, [onFullscreen])

        useEffect(() => {
            getKakaoProfile()
            
        }, [])
        
        return (
            <LinearGradient colors={currentBackgroundColor} style={{flex: 1}}>
                <Topbar left={leftButton()}/>
                <SafeAreaView style={{flex: 5}}>
                    <View style={{height:'29%', justifyContent: 'space-between', marginHorizontal: '12%'}}>
                        <View style={styles.iconCover}>
                            <Image source={{uri: profileImage}} style={{width: '100%', height: '100%', borderRadius: width * 0.17,}}/>
                        </View>
                        <Text style={[styles.text2xl, styles.fontBold, {color: 'white'}]}>Hello, {nickname}.</Text>
                        <Text style={[styles.textLg, {color: '#D9D9D9'}]}>{profileImage}</Text>
                        <Text style={[styles.textBase, {color: 'white'}]}>{dateToString(new Date())}</Text>
                    </View>
                </SafeAreaView>
                <Animated.View style={{
                        position: 'absolute',
                        top: aniTop,
                        width: width, 
                        height: aniHeight,
                    }}>
                        <ScrollView style={{}}
                        contentContainerStyle={{}}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={handleCardIndex}
                        ref={scrollViewRef}
                        scrollEnabled={!onFullscreen}
                        >
                            {Todos.map((item, idx) => (
                                <TodoCard cardWidth={cardWidth} cardMargin={cardMargin} todoListOpacity={todoListOpacity} todoListHeight={todoListHeight}
                                eventHandler={panResponder.panHandlers}
                                onFullscreen={onFullscreen}
                                setOnFullscreen={setOnFullscreen}
                                todos={item}
                                cardIndex = {idx}
                                currentIndex = {currentIndex}/>
                            ))}

                        </ScrollView>
                    </Animated.View>
            </LinearGradient>
    )
}

export default Home