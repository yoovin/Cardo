import { View, Text, SafeAreaView, ScrollView, Dimensions, Animated, PanResponder, TouchableOpacity, Image } from 'react-native'
import React, {useState, useRef, useEffect} from 'react'
import styles from '../styles'
import LinearGradient from 'react-native-linear-gradient'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {RFPercentage} from "react-native-responsive-fontsize"
import { MenuView } from '@react-native-menu/menu'
import Dialog from "react-native-dialog"
import { logout, unlink } from '@react-native-seoul/kakao-login'


import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { isAddTaskFullScreen, isMenuShow, Language, isSigned, ProfileImage} from './recoil/atom' 
import ChangeIconView from './ChangeIconView'
import ChangeColorView from './ChangeColorView'
import AsyncStorage from '@react-native-async-storage/async-storage'


import TodoCard from './TodoCard'
import Topbar from './Topbar';
import { dateToString } from './utils'
import appleAuth from '@invertase/react-native-apple-authentication'

const { width, height } = Dimensions.get('window')


// 더미
const Todos = [
    {
        id: 1,
        userid: 'yoo',
        icon: 'person',
        title: 'Personal',
        todos: [],
        color: ['#f69744', '#e9445d']
    },
    {
        id: 2,
        userid: 'yoo',
        icon: 'book',
        title: 'Work',
        todos: [],
        color: ['#5297e1', '#4048df']
    },
    {
        id: 3,
        userid: 'yoo',
        icon: 'home',
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
    const [isShowMenu, setIsShowMenu] = useRecoilState(isMenuShow)
    const [isShowDialog, setIsShowDialog] = useState(false)
    const setSigned = useSetRecoilState(isSigned)

    // 언어
    const [language, setLanguage] = useRecoilState(Language)

    const [animation] = useState(new Animated.Value(0))
    const [iconChangeViewAnimation] = useState(new Animated.Value(0))
    const [colorChangeViewAnimation] = useState(new Animated.Value(0))
    // const [colorAnimation] = useState(new Animated.Value(0))

    const [nickname, setNickname] = useState('')
    const profileImage = useRecoilValue(ProfileImage)

    const signOutWithKakao = async (): Promise<void> => {
        await logout()
    }

    const logout = async () => {
        const howLog = await AsyncStorage.getItem('howLog')
        if(howLog === 'kakao'){
            await signOutWithKakao()
        }
        if(howLog === 'apple'){
            appleAuth.onCredentialRevoked(() => {console.log('애플 로그아웃')})
        }
        AsyncStorage.clear()
        setSigned(false)
    }

    const setCurLang = async() => {
        const curLanguage = await AsyncStorage.getItem('language')
        if(curLanguage){
            setLanguage(curLanguage)
        }
    }

    const leftButton = () => {
        if(onFullscreen){// 전체화면
            if(isaddTaskFullScreen){ // AddTask화면
                return(
                    <TouchableOpacity onPress={() => {
                        setIsaddTaskFullScreen(false)
                    }}>
                        <Ionicons name="close" size={RFPercentage(3)} color='#9a9a9a'></Ionicons>
                    </TouchableOpacity>)
            }else{
                return( // 카드 화면
                <TouchableOpacity onPress={() => {
                    changeIconViewAnimateOut()
                    setOnFullscreen(false)
                }}>
                    <AntDesign name="arrowleft" size={RFPercentage(3)} color='#9a9a9a'></AntDesign>
                </TouchableOpacity>)
            }            
        }else{
            
        }
            
            
    }

    const rightButton = () => {
        if(onFullscreen){ // 전체화면
            if(!isaddTaskFullScreen){ // AddTask화면이 아닐때
                return(todoCardMenu)
            }
        }else{ // 홈화면
            return(homeMenu)
        }
    }

    /**
     * ===== Menu View =====
     */

    const homeMenu = 
        <MenuView
            title="메뉴"
            onPressAction={async ({ nativeEvent }) => {
                if(nativeEvent.event == "logout"){
                    setIsShowDialog(true)
                }

                if(nativeEvent.event == "english"){
                    await AsyncStorage.setItem('language', 'en')
                    setLanguage('en')
                }

                if(nativeEvent.event == "korean"){
                    await AsyncStorage.setItem('language', 'ko')
                    setLanguage('ko')
                }

                if(nativeEvent.event == "japanese"){
                    await AsyncStorage.setItem('language', 'ja')
                    setLanguage('ja')
                }
            }}
            actions={[
                {
                    id:'language',
                    title: "언어설정",
                    image:"globe.asia.australia.fill",
                    subactions: [
                        {
                            id:'english',
                            title: "English",
                            image:"a.square"
                        },
                        {
                            id:'korean',
                            title: "한국어",
                            image:"k.square"
                        },
                        {
                            id:'japanese',
                            title: "日本語",
                            image:"j.square"
                        },
                    ]
                },
                {
                    id:'logout',
                    title: "로그아웃",
                    image:"rectangle.portrait.and.arrow.forward"
                },
            ]}      
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setIsShowMenu(val => !val)}
                >
                    <Ionicons name="ios-menu" size={RFPercentage(3)} color='white'></Ionicons>
                </TouchableOpacity>
        </MenuView>

    const todoCardMenu = 
    <MenuView
        title="카드 메뉴"
        onPressAction={({ nativeEvent }) => {
            if(nativeEvent.event == "changeIcon"){
                changeColorViewAnimateOut()
                changeIconViewAnimateIn()
            }
            if(nativeEvent.event == "changeColor"){
                changeIconViewAnimateOut()
                changeColorViewAnimateIn()
            }
        }}
        actions={[
            {
                id:'changeIcon',
                title: "아이콘 바꾸기",
                image:'person.fill.and.arrow.left.and.arrow.right'
            },
            {
                id:'changeColor',
                title: "색 바꾸기",
                image:'paintpalette'
            },
        ]}      
        >
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsShowMenu(val => !val)}
            >
                <Ionicons name="ios-menu" size={RFPercentage(3)} color='#9a9a9a'></Ionicons>
            </TouchableOpacity>
    </MenuView>

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

    const changeIconViewBottom = iconChangeViewAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['150%', '0%']
    })

    const changeColorViewBottom = colorChangeViewAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['200%', '100%']
    })

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

    const changeIconViewAnimateIn = () => {
        Animated.spring(iconChangeViewAnimation, {
            toValue: 1,
            friction: 3,
            tension: 1,
            useNativeDriver: false,
        }).start()
    }

    const changeIconViewAnimateOut = () => {
        Animated.spring(iconChangeViewAnimation, {
            toValue: 0,
            friction: 3,
            tension: 1,
            useNativeDriver: false,
        }).start()
    }

    const changeColorViewAnimateIn = () => {
        Animated.spring(colorChangeViewAnimation, {
            toValue: 1,
            friction: 3,
            tension: 1,
            useNativeDriver: false,
        }).start()
    }

    const changeColorViewAnimateOut = () => {
        Animated.spring(colorChangeViewAnimation, {
            toValue: 0,
            friction: 3,
            tension: 1,
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
        if(index < Todos.length){
            // 유저가 보고있는 카드가 투두 추가 카드가 아니면 색을 변경
            setCurrentBackgroundColor(Todos[index].color)
        }
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

            // 언어설정
            setCurLang()
        }, [])
        
        return (
            <LinearGradient colors={currentBackgroundColor} style={{flex: 1}}>
                <Topbar left={leftButton()} right={rightButton()}/>
                {onFullscreen && <ChangeIconView color={Todos[currentIndex].color} changeIconViewBottom={changeIconViewBottom} changeIconViewAnimateOut={changeIconViewAnimateOut}/>}
                {onFullscreen && <ChangeColorView changeColorViewBottom={changeColorViewBottom} changeColorViewAnimateOut={changeColorViewAnimateOut}/>}
                <SafeAreaView style={{flex: 1, top: '6%'}}>
                    <View style={{height:'29%', justifyContent: 'space-between', marginHorizontal: '12%'}}>
                        <View style={styles.iconCover}>
                            {profileImage ? <Image source={{uri: profileImage}} style={{width: '100%', height: '100%', borderRadius: width * 0.17,}}/> 
                            :<Ionicons name="logo-apple" size={RFPercentage(3.5)} color={'#adacac'}></Ionicons>}
                        </View>
                        <Text style={[styles.text2xl, styles.fontBold, {color: 'white'}]}>
                            {language === 'en' && 'Hello, '}
                            {language === 'ko' && '안녕하세요, '}
                            {language === 'ja' && 'こんにちは, '}
                            {nickname}.
                            </Text>
                        <Text style={[styles.textBase, {color: '#D9D9D9', opacity: 0.7}]}>
                            {language === 'en' && 'Looks like feel good. '}
                            {language === 'ko' && '기분이 좋아보이네요. '}
                            {language === 'ja' && '気持ちがよさそう。 '}
                            
                            </Text>
                        <Text style={[styles.textSm, {color: 'white'}]}>{dateToString(new Date(), language)}</Text>
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
                            {/* 카드 추가용 페이지 */}
                            <Animated.View style={[styles.todoCard,{
                                width: cardWidth,
                                marginHorizontal: cardMargin,
                                borderRadius: width * 0.03,}]}>
                                <TouchableOpacity
                                style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                    <Ionicons name="add-circle-outline" size={RFPercentage(10)} color={'#575555'}></Ionicons>
                                    <Text style={[styles.fontBold, styles.textLg, {color: '#575555'}]}>투두 카드 추가</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </ScrollView>
                    </Animated.View>
                    <Dialog.Container visible={isShowDialog} contentStyle={styles.dialog}>
                        <Dialog.Description>
                            로그아웃 하시겠습니까?
                        </Dialog.Description>
                        <Dialog.Button label="예" color="black" 
                        onPress={() => {
                            logout()
                            setIsShowDialog(false)
                        }}></Dialog.Button>
                        <Dialog.Button label="아니오" color="black" onPress={()=>setIsShowDialog(false)}></Dialog.Button>
                    </Dialog.Container>
            </LinearGradient>
    )
}

export default Home