import { View, Text, Dimensions, Animated, SafeAreaView, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Alert, TextInput, Modal, Button, PanResponder } from 'react-native'
import React, {useState, useRef, useEffect} from 'react'
import styles from '../styles';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {RFPercentage} from "react-native-responsive-fontsize"
import SimpleGradientProgressbarView from "react-native-simple-gradient-progressbar-view"
import { useMutation, useQueryClient } from 'react-query'
import { compareDate, dateToString, dateToStringFull, dateToStringWithoutYear, isToday } from './utils'
import DatePicker from 'react-native-date-picker'
import { useRecoilValue } from 'recoil'
import { Language } from './recoil/atom'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const localizatedText: {[key: string]: string[]} = {
    // [투두, 날짜, 시간, 지정안함, 날짜선택, 시간선택, 완료, 취소, 로케일]
    'en': ['What tasks are you planning to perform?', 'Date', 'Time', 'Do not specify', 'Select date', 'Select time', 'confirm', 'cancel', 'en-US'],
    'ko': ['어떤 멋진 일을 계획하고 있나요?', '날짜 바꾸기', '시간 바꾸기', '지정안함', '날짜를 선택해주세요', '시간을 선택해주세요', '완료', '취소', 'ko_KR'],
    'ja': ['どんな素敵なことを計画してますか？', '日付', '時間', 'なし', '日付を選んでください', '時間を選んでください', '完了', '取消', 'ja-JP']
}

import AddTask from './AddTask';
import Topbar from './Topbar';
import TodoContent from './TodoContent';
import axios from 'axios';

import todoContent from '../interface/todoContent';
const { width, height } = Dimensions.get('window');

type Props = {
    cardWidth: any
    cardMargin: any
    todoListOpacity: any
    todoListHeight: any
    eventHandler: any
    onFullscreen: boolean
    setOnFullscreen: Function
    cardIndex: number
    currentIndex: number
    changeIcon?: boolean
    changeColorViewAnimateOut: Function
    changeIconViewAnimateIn: Function
    setIsScrolling: Function
    todo: any
}

const TodoCard = (props: Props) => {
    const [isIconChanging, setisIconChanging] = useState(false)
    const [animation] = useState(new Animated.Value(0))
    const [title, setTitle] = useState(props.todo.title)
    const queryClient = useQueryClient()
    const language = useRecoilValue(Language)
    const [todayTask, setTodayTask] = useState(0)
    const [todayTaskComplete, setTodayTaskComplete] = useState(0)

    // Modal
    const [modalVisible, setModalVisible] = useState(false)
    const [currentTask, setCurrentTask] = useState('')
    const [currentIndex, setCurrentIndex] = useState('')
    const [date, setDate] = useState(new Date())
    const [onDateOpen, setOnDateOpen] = useState(false)
    const [onTimeOpen, setOnTimeOpen] = useState(false)

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                // 사용자가 화면을 터치했을 때 제스처를 인식하도록 설정
                return true;
            },
            onPanResponderMove: (evt, gestureState) => {
                if(gestureState.dy > 50) {
                    // 사용자가 손가락을 아래로 50픽셀 이상 움직였을 때 실행할 로직
                    setModalVisible(false)
                }
            },
        })).current

    const changeIcon = () => {
        if(props.onFullscreen){ // 이미 풀스크린이라면 바로 다음 애니메이션
            props.changeColorViewAnimateOut()
            props.changeIconViewAnimateIn()
        }else{ // 아니라면 풀스크린으로
            props.setOnFullscreen(true)
        }
    }

    const { mutate, isLoading } = useMutation(
        (option: any) => axios.patch('/todo/change/title', option),
            {
                onSuccess: () => {
                    // 데이터 업데이트 성공 시 캐시를 갱신합니다.
                    queryClient.invalidateQueries("todos")
                },
            }
        )

    const changeDate = useMutation(
        (option: any) => axios.patch('/todo/change/date', option),
            {
                onSuccess: () => {
                    // 데이터 업데이트 성공 시 캐시를 갱신합니다.
                    queryClient.invalidateQueries("todos")
                },
            }
        )

    const changeTime = useMutation(
        (option: any) => axios.patch('/todo/change/time', option),
            {
                onSuccess: () => {
                    // 데이터 업데이트 성공 시 캐시를 갱신합니다.
                    queryClient.invalidateQueries("todos")
                },
            }
        )

    const changeTitle = () => {
        mutate({id: props.todo._id, title})
    }

    /**
     * 오늘 할 일의 개수 및 완료 개수를 체크해서 state에 저장
     */
    const checkTodayTask = () => {
        setTodayTask(0)
        setTodayTaskComplete(0)
        for(let task of props.todo.todos){
            if(task.date && isToday(new Date(task.date))){
                console.log(task)
                setTodayTask(val => val+1)
                if(task.is_complete){
                    setTodayTaskComplete(val => val+1)
                }
            }
        }
    }

    let currentDate = new Date(0)

    useEffect(() => {
        // 오늘 할일 개수 체크
        checkTodayTask()
        console.log('todo 변경됨')
    }, [props.todo])


    return(
        <Animated.View style={[styles.todoCard,{
            width: props.cardWidth,
            marginHorizontal: props.cardMargin,
            borderRadius: width * 0.03,}]}>
                    {props.cardIndex === props.currentIndex && <AddTask color={props.todo.color} ButtonOpacity={props.todoListOpacity} todo_id={props.todo._id}/>}
            <SafeAreaView style={{flex: 1}}
            >
                {/* 작아졌을 때 카드 전체가 제스쳐인식이 가능하게끔 높이를 높여줌 */}
                <View style={[!props.onFullscreen && {height: '100%'}]}
                {...props.eventHandler}>
                    <View style={[{padding:'10%', justifyContent: 'space-between', borderRadius: width * 0.03}, props.onFullscreen && {paddingTop:'15%'}]}>
                        <TouchableOpacity style={styles.iconCover}
                        onPress={() => changeIcon()}
                        >
                            <Ionicons name={props.todo.icon} size={RFPercentage(3.5)} color={props.todo.color[0]}></Ionicons>
                        </TouchableOpacity>
                        <View style={{marginVertical: '5%'}}>
                            <Text style={[styles.textBase, styles.fontBold, {marginBottom: 10, color: '#a0a0a0'}]}>{todayTask} Tasks</Text>
                                <TextInput style={[styles.text2xl, {marginBottom: 10}]}
                                value={title}
                                onChangeText={setTitle}
                                editable={props.onFullscreen}
                                onBlur={changeTitle}/>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <SimpleGradientProgressbarView
                                style={{width: width * 0.6, height:height * 0.005, backgroundColor: '#D9D9D9'}}
                                fromColor={props.todo.color[0]}
                                toColor={props.todo.color[1]}
                                progress={todayTask > 0 && todayTaskComplete > 0 ? todayTaskComplete / todayTask : 0}
                                maskedCorners={[1, 1, 0, 0]}
                                cornerRadius={0} 
                                />
                                <Text style={[styles.progressText, styles.textSm]}>{todayTask > 0 && todayTaskComplete > 0 ? Math.ceil((todayTaskComplete / todayTask) * 100) : 0}%</Text>
                            </View>
                        </View>
                    </View>
                </View>
                    <Animated.View style={{height: props.todoListHeight, marginHorizontal: '10%', paddingBottom: '30%', opacity: props.todoListOpacity}}>
                        <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}>
                            
                            {props.todo.todos[0] && props.todo.todos[0].date === null && <Text style={styles.dateText}>지정안함</Text>}
                            {props.todo.todos.map((item: todoContent, idx:number) => {
                                // date가 null이거나 지정된 날짜와 같은 경우(이전 컨텐츠와 같은 날짜)면 날짜를 표시하지않고 넘어감.
                                if(compareDate(currentDate, new Date(item.date)) || item.date === null){
                                    return <TodoContent key={idx} idx={idx} todo_id={props.todo._id} todo={item} setModalVisible={setModalVisible} setCurrentTask={setCurrentTask} setCurrentIndex={setCurrentIndex} setDate={setDate}/>
                                }else{
                                    // 만약 이전 컨텐츠의 날짜와 다른 경우 날짜를 바꿔주고 표시함.
                                    currentDate = new Date(item.date)
                                    // 오늘 날짜의 투두는 '오늘'이라고 개별 표시
                                    if(isToday(currentDate)){
                                        return(<>
                                            <Text style={styles.dateText}>오늘</Text>
                                            <TodoContent key={idx} idx={idx} todo_id={props.todo._id} todo={item} setModalVisible={setModalVisible} setCurrentTask={setCurrentTask} setCurrentIndex={setCurrentIndex} setDate={setDate}/>
                                            </>)
                                    }else{
                                        return(<>
                                            <Text style={styles.dateText}>
                                                {currentDate.getFullYear() === new Date().getFullYear() 
                                                ? 
                                                    dateToStringWithoutYear(currentDate, language, true) 
                                                :   
                                                    dateToStringFull(currentDate, language)}
                                                </Text>
                                            <TodoContent key={idx} idx={idx} todo_id={props.todo._id} todo={item} setModalVisible={setModalVisible} setCurrentTask={setCurrentTask} setCurrentIndex={setCurrentIndex} setDate={setDate}/>
                                            </>)
                                    }
                                }
                            })}
                        </KeyboardAwareScrollView>
                        <DatePicker
                            modal
                            open={onDateOpen}
                            date={date}
                            onConfirm={(date) => {
                            setOnDateOpen(false)
                            changeDate.mutate({...props.todo.todos[currentIndex], id: props.todo._id, date})
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
                            onConfirm={(time) => {
                            setOnTimeOpen(false)
                            changeTime.mutate({time, id: props.todo._id, index: props.todo.todos[currentIndex].index})
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
            </SafeAreaView>
            <Modal
                    transparent={true}
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={() => {
                    setModalVisible(!modalVisible)
                    }}
                    >
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
                            <View style={styles.menuModal}
                            {...panResponder.panHandlers}>
                                <View style={{flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between', }}>
                                        <Text style={styles.cancelText}>      </Text>
                                        <Text style={styles.fontBold}>{currentTask}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setModalVisible(false)
                                        }}>
                                        <Text style={styles.confirmText}>완료</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.subMenu, {width: '100%', height: '30%'}]}>
                                    <TouchableOpacity style={styles.subMenuButton}
                                    onPress={() => {
                                            setOnDateOpen(true)
                                        }}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Ionicons name="calendar-sharp" size={RFPercentage(3)} color='#9a9a9a'></Ionicons>
                                            <Text style={[styles.textLg, {color: 'gray', marginHorizontal: '10%'}]}>{localizatedText[language][1]}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.subMenu, {width: '100%', height: '30%'}]}>
                                    <TouchableOpacity style={styles.subMenuButton}
                                    onPress={() => {
                                            setOnTimeOpen(true)
                                        }}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Ionicons name="time-outline" size={RFPercentage(3)} color='#9a9a9a'></Ionicons>
                                            <Text style={[styles.textLg, {color: 'gray', marginHorizontal: '10%'}]}>{localizatedText[language][2]}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
        </Animated.View>
    )
}

export default TodoCard