import { View, Text, Dimensions, Animated, SafeAreaView, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native'
import React, {useState, useRef, useEffect} from 'react'
import styles from '../styles';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {RFPercentage} from "react-native-responsive-fontsize"
import SimpleGradientProgressbarView from "react-native-simple-gradient-progressbar-view"

import AddTask from './AddTask';
import Topbar from './Topbar';

const { width, height } = Dimensions.get('window');

type Props = {
    cardWidth: any,
    cardMargin: any,
    todoListOpacity: any,
    todoListHeight: any,
    eventHandler: any,
    onFullscreen: boolean,
    setOnFullscreen: Function,
    cardIndex: number,
    currentIndex: number,
    changeIcon?: boolean

    todos: any,
}

const TodoCard = (props: Props) => {
    const [isIconChanging, setisIconChanging] = useState(false)
    const [animation] = useState(new Animated.Value(0))

    /**
     *  애니메이션
     */
    const animateIn = () => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start()
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
    }

    const changeIcon = () => {
        if(props.onFullscreen){ // 이미 풀스크린이라면 바로 다음 애니메이션
        }else{ // 아니라면 바뀌는 시간 기다리고나서 다음 애니메이션
            props.setOnFullscreen(true)
            setTimeout(() => {
            }, 500)
        }
    }

    return(
        <Animated.View style={[styles.todoCard,{
            width: props.cardWidth,
            marginHorizontal: props.cardMargin,
            borderRadius: width * 0.03,}]}>
                    {props.cardIndex === props.currentIndex && <AddTask color={props.todos.color} ButtonOpacity={props.todoListOpacity}/>}
            <SafeAreaView style={{flex: 1}}
            {...props.eventHandler}>
                <View style={[{flex:1, padding:'10%', justifyContent: 'space-between', borderRadius: width * 0.03}, props.onFullscreen && {paddingTop:'15%'}]}>
                    <TouchableOpacity style={styles.iconCover}
                    onPress={() => changeIcon()}
                    onLongPress={() => {
                        setisIconChanging(true)
                    }}
                    >
                        <Ionicons name={props.todos.icon} size={RFPercentage(3.5)} color={props.todos.color[0]}></Ionicons>
                    </TouchableOpacity>
                    <View style={{marginVertical: '5%'}}>
                        <Text style={[styles.textBase, styles.fontBold, {marginBottom: 10, color: '#a0a0a0'}]}>9 Tasks</Text>
                        <Text style={[styles.text2xl, {marginBottom: 10}]}>{props.todos.title}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <SimpleGradientProgressbarView
                            style={{width: width * 0.6, height:height * 0.005, backgroundColor: '#D9D9D9'}}
                            fromColor='#f69744'
                            toColor='#e9445d'
                            progress={0.5}
                            maskedCorners={[1, 1, 0, 0]}
                            cornerRadius={0} 
                            />
                            <Text style={[styles.progressText, styles.textSm]}>50%</Text>
                        </View>
                    </View>
                    <Animated.View style={{height: props.todoListHeight, opacity: props.todoListOpacity}}>
                        <ScrollView>

                        </ScrollView>
                        
                    </Animated.View>
                </View>
            </SafeAreaView>
        </Animated.View>
    )
}

export default TodoCard