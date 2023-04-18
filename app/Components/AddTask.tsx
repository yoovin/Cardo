import { View, Text, TouchableOpacity, Dimensions, Animated, KeyboardAvoidingView, TextInput, SafeAreaView, PanResponder, TouchableWithoutFeedback, Keyboard, Easing} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {RFPercentage} from "react-native-responsive-fontsize"

import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'
import { isAddTaskFullScreen, titleText, Language, Sessionid } from './recoil/atom'
import styles from '../styles'
import DatePicker from 'react-native-date-picker'
import { dateToString } from './utils'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)
const { width, height } = Dimensions.get('window')
const localizatedText: {[key: string]: string[]} = {
    // [투두, 날짜, 시간, 지정안함, 날짜선택, 시간선택, 완료, 취소, 로케일]
    'en': ['What tasks are you planning to perform?', 'Date', 'Time', 'Do not specify', 'Select date', 'Select time', 'confirm', 'cancel', 'en-US'],
    'ko': ['어떤 멋진 일을 계획하고 있나요?', '날짜', '시간', '지정안함', '날짜를 선택해주세요', '시간을 선택해주세요', '완료', '취소', 'ko_KR'],
    'ja': ['どんな素敵なことを計画してますか？', '日付', '時間', 'なし', '日付を選んでください', '時間を選んでください', '完了', '取消', 'ja-JP']
}

type Props = {
    ButtonOpacity: any
    color: Array<string>
    todo_id: string
}

const AddTask = (props: Props) => {
    const queryClient = useQueryClient()

    const sessionid = useRecoilValue(Sessionid)
    const [isFullScreen, setIsFullScreen] = useRecoilState(isAddTaskFullScreen)
    const setTitleText = useSetRecoilState(titleText)
    const [buttonRadius, setButtonRadius] = useState(width/12)
    const [animation] = useState(new Animated.Value(0))
    const [buttonAnimation] = useState(new Animated.Value(0))
    const taskInputRef = useRef<any>(null)

    const [taskContent, setTaskContent] = useState('')
    const [canAdd, setCanAdd] = useState(true)
    const [isDateSelected, setIsDateSelected] = useState(false)
    const [isTimeSelected, setIsTimeSelected] = useState(false)
    const [date, setDate] = useState(new Date())
    const [onDateOpen, setOnDateOpen] = useState(false)
    const [onTimeOpen, setOnTimeOpen] = useState(false)

    // 언어
    const language = useRecoilValue(Language)


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
        })).current

    const stateClear = () => {
        setTaskContent('')
        setIsDateSelected(false)
        setIsTimeSelected(false)
        setDate(new Date())
    }

    const { mutate, isLoading } = useMutation(
        (task: any) => axios.post('/todo/addtask', task),
            {
                onSuccess: () => {
                    // 데이터 업데이트 성공 시 캐시를 갱신합니다.
                    setIsFullScreen(false)
                },
            }
        )
        
    const addTask = () => {
        const task: any = {
            id: props.todo_id, 
            task: taskContent,
        }

        if(isDateSelected){
            task.date = date
        }
        
        if(isTimeSelected){
            task.time = date
        }
        mutate(task)
    }

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
        queryClient.invalidateQueries("todos")
        stateClear()
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
        taskContent.length > 0 ? setCanAdd(true) : setCanAdd(false)
    }, [taskContent])


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

    return (
        <Animated.View style={{position: 'absolute', top:aniTop, left: aniLeft, opacity: props.ButtonOpacity, zIndex: 990}}
        {...panResponder.panHandlers}>
                    <Animated.View style={{top:'11%', width: width, height: aniHeight, alignItems:'center',backgroundColor: 'white', opacity: animation}}>
                        <Text style={[styles.textBase, {color: 'gray', marginTop: 30}]}>{localizatedText[language][0]}</Text>
                        <TextInput 
                        ref={taskInputRef}
                        onChangeText={setTaskContent}
                        value={taskContent}
                        style={styles.taskInput}
                        />
                        <View style={styles.subMenu}>
                            <TouchableOpacity style={styles.subMenuButton}
                            onPress={() => setOnDateOpen(true)}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Ionicons name="calendar-sharp" size={RFPercentage(3)} color='#9a9a9a'></Ionicons>
                                    <Text style={[styles.textLg, {color: 'gray', marginHorizontal: '10%'}]}>{localizatedText[language][1]}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={[styles.textLg, {color: 'gray'}]}>{isDateSelected ? dateToString(date, language) : localizatedText[language][3]}</Text>
                                    <Text style={[styles.textLg, {color: 'gray', marginLeft: 10}]}>{'>'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.subMenu}>
                            <TouchableOpacity style={styles.subMenuButton}
                            onPress={() => setOnTimeOpen(true)}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Ionicons name="time-outline" size={RFPercentage(3)} color='#9a9a9a'></Ionicons>
                                    <Text style={[styles.textLg, {color: 'gray', marginHorizontal: '10%'}]}>{localizatedText[language][2]}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={[styles.textLg, {color: 'gray'}]}>{isTimeSelected ? `${date.getHours()} : ${date.getMinutes()}` : localizatedText[language][3]}</Text>
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
                            setIsDateSelected(true)
                            }}
                            onCancel={() => {
                            setOnDateOpen(false)
                            }}
                            mode='date'
                            title={localizatedText[language][4]}
                            confirmText={localizatedText[language][6]}
                            cancelText={localizatedText[language][7]}
                            locale={localizatedText[language][8]}
                        />
                        <DatePicker
                            modal
                            open={onTimeOpen}
                            date={date}
                            onConfirm={(date) => {
                            setOnTimeOpen(false)
                            setDate(date)
                            setIsTimeSelected(true)
                            }}
                            onCancel={() => {
                            setOnTimeOpen(false)
                            }}
                            mode='time'
                            title={localizatedText[language][5]}
                            confirmText={localizatedText[language][6]}
                            cancelText={localizatedText[language][7]}
                            locale={localizatedText[language][8]}
                        />
                    </Animated.View>
                    <AnimatedTouchable style={{bottom: buttonAnimation, width: aniButtonWidth, height: width/6, borderRadius: aniButtonRadius}}>
                    <TouchableOpacity
                    onPress={() => {
                        console.log(isFullScreen)
                        if(!isFullScreen){
                            setIsFullScreen(true)
                            
                        }else{
                            addTask()
                        }
                    }}
                    style={{width: '100%', height: height/15}}
                    >
                        <LinearGradient colors={canAdd || !isFullScreen ? props.color: ['#bababa', '#505251']} style={{
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