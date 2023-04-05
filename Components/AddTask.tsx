import { View, Text, TouchableOpacity, Dimensions, Animated, KeyboardAvoidingView, TextInput, SafeAreaView, PanResponder, TouchableWithoutFeedback, Keyboard, Easing} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {RFPercentage} from "react-native-responsive-fontsize"

import { useRecoilState, useSetRecoilState } from 'recoil'
import { isAddTaskFullScreen, titleText } from './recoil/atom'
import styles from '../styles'
import DatePicker from 'react-native-date-picker'

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

const { width, height } = Dimensions.get('window');

type Props = {
    ButtonOpacity: any
    color: Array<string>
}

const AddTask = (props: Props) => {
    const [isFullScreen, setIsFullScreen] = useRecoilState(isAddTaskFullScreen)
    const setTitleText = useSetRecoilState(titleText)
    const [buttonRadius, setButtonRadius] = useState(width/12)
    const [animation] = useState(new Animated.Value(0))
    const [buttonAnimation] = useState(new Animated.Value(0))
    const taskInputRef = useRef<any>(null)

    const [canAdd, setCanAdd] = useState(true)
    const [date, setDate] = useState(new Date())
    // const [time, setTime] = useState(new Date())
    const [onDateOpen, setOnDateOpen] = useState(false)
    const [onTimeOpen, setOnTimeOpen] = useState(false)


    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                // 사용자가 화면을 터치했을 때 제스처를 인식하도록 설정
                return true;
            },
            onPanResponderMove: (evt, gestureState) => {
                // 사용자가 손가락을 위로 움직였을 때 실행되는 콜백 함수
                if (gestureState.dy < -70 && !isFullScreen ) {
                    // 사용자가 손가락을 위로 70픽셀 이상 움직였을 때 실행할 로직
                    setIsFullScreen(true)
                }else if(gestureState.dy > 70) {
                    // 사용자가 손가락을 아래로 70픽셀 이상 움직였을 때 실행할 로직
                    setIsFullScreen(false)
                }
            },
        })).current;

    /**
     *  애니메이션
     */
    const animateIn = () => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            // easing: Easing.ease,
            useNativeDriver: false,
        }).start()
        setButtonRadius(0)
        setTitleText('새 일정')
        setCanAdd(false)
    }

    /**
     *  해제 애니메이션
     */
    const animateOut = () => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start()
        setButtonRadius(width/12)
        setTitleText('')
        setCanAdd(true)
        Keyboard.dismiss()
    }



    const aniTop = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['85%', '0%']
    })

    const aniLeft = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['75%', '0%']
    })

    const aniHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, height - (height / 15)]
    })

    const aniButtonWidth = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [width/7, width]
    })

    const aniButtonRadius = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [width/12, 0]
    })

    useEffect(() => {
        if(isFullScreen){
            animateIn()
        }else{
            animateOut()
        }
    }, [isFullScreen])

    useEffect(() => {
        console.log("task 버튼 생겼습니다.")

        const animationListener = animation.addListener((state: {value: number}) => {
            if(state.value === 1){               
                taskInputRef.current.focus()
            }
        })

        return () => {
            animation.removeListener(animationListener)
        }
    }, [])

    // useEffect(() => {
    //     console.log('이벤트 리스너 등록')
    //     const keyboardDidShowListener = Keyboard.addListener(
    //         'keyboardDidShow',
    //             (e) => {
    //                 Animated.timing(buttonAnimation, {
    //                     toValue: e.endCoordinates.height,
    //                     duration: 500,
    //                     useNativeDriver: false,
    //                 }).start()
    //                 console.log('키보드가 올라왔습니다');
    //             },
    //         );
        
    //         const keyboardDidHideListener = Keyboard.addListener(
    //         'keyboardDidHide',
    //             () => {
    //                 Animated.timing(buttonAnimation, {
    //                     toValue: 0,
    //                     duration: 500,
    //                     useNativeDriver: false,
    //                 }).start()
    //                 console.log('키보드가 내려갔습니다');
    //             },
    //         );
        
    //         // 컴포넌트가 언마운트될 때, 이벤트 리스너를 해제합니다.
    //         return () => {
    //             keyboardDidShowListener.remove();
    //             keyboardDidHideListener.remove();
    //         };
    //     }, [])

    return (
        <Animated.View style={{position: 'absolute', top:aniTop, left: aniLeft, opacity: props.ButtonOpacity, zIndex: 990}}
        {...panResponder.panHandlers}>
                    <Animated.View style={{top:'11%', width: width, height: aniHeight, alignItems:'center',backgroundColor: 'white', opacity: animation}}>
                        <Text style={[styles.textBase, {color: 'gray', marginTop: 30}]}>어떤 멋진 일을 계획하고 있나요?</Text>
                        <TextInput 
                        ref={taskInputRef}
                        style={styles.taskInput}
                        />
                        <View style={styles.subMenu}>
                            <TouchableOpacity style={styles.subMenuButton}
                            onPress={() => setOnDateOpen(true)}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Ionicons name="calendar-sharp" size={RFPercentage(3)} color='#9a9a9a'></Ionicons>
                                    <Text style={[styles.textLg, {color: 'gray', marginHorizontal: '10%'}]}>날짜</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={[styles.textLg, {color: 'gray'}]}>지정안함</Text>
                                    <Text style={[styles.textLg, {color: 'gray', marginLeft: 10}]}>{'>'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.subMenu}>
                            <TouchableOpacity style={styles.subMenuButton}
                            onPress={() => setOnTimeOpen(true)}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Ionicons name="time-outline" size={RFPercentage(3)} color='#9a9a9a'></Ionicons>
                                    <Text style={[styles.textLg, {color: 'gray', marginHorizontal: '10%'}]}>시간</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={[styles.textLg, {color: 'gray'}]}>지정안함</Text>
                                    <Text style={[styles.textLg, {color: 'gray', marginLeft: 10}]}>{'>'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <DatePicker
                            modal
                            open={onDateOpen}
                            date={date}
                            onConfirm={(date) => {
                            setOnDateOpen(false)
                            setDate(date)
                            }}
                            onCancel={() => {
                            setOnDateOpen(false)
                            }}
                            mode='date'
                            title="날짜를 선택 해 주세요."
                            confirmText='완료'
                            cancelText='취소'
                            locale='ko-KR'
                        />
                        <DatePicker
                            modal
                            open={onTimeOpen}
                            date={date}
                            onConfirm={(date) => {
                            setOnTimeOpen(false)
                            console.log(date)
                            // setDate(date)
                            }}
                            onCancel={() => {
                            setOnTimeOpen(false)
                            }}
                            mode='time'
                            title="시간을 선택 해 주세요."
                            confirmText='완료'
                            cancelText='취소'
                            locale='ko-KR'
                        />



                        {/* <Text style={[styles.textBase, {color: 'gray', marginTop: 30}]}>날짜는요?</Text> */}
                        
                    </Animated.View>
            <AnimatedTouchable style={{bottom: buttonAnimation, width: aniButtonWidth, height: width/6, borderRadius: aniButtonRadius}}>
                    <TouchableOpacity
                    onPress={() => {
                        console.log(isFullScreen)
                        if(!isFullScreen){
                            setIsFullScreen(true)
                            
                        }else{
                            setIsFullScreen(false)
                        }
                    }}
                    style={{width: '100%', height: height/15}}
                    >
                        <LinearGradient colors={canAdd ? props.color: ['#bababa', '#505251']} style={{
                            width: '100%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: buttonRadius
                        }}>
                            <Ionicons name="md-add-outline" size={RFPercentage(5)} color='white'></Ionicons>
                        </LinearGradient>
                    </TouchableOpacity>
                </AnimatedTouchable>
        </Animated.View>
    )
}

export default AddTask