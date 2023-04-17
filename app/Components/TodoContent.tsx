import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from '../styles'
import CheckBox from '@react-native-community/checkbox'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {RFPercentage} from "react-native-responsive-fontsize"

type Props = {
    content: string
    time?: Date
}

/**
 * 
 * @param props 
 * @returns 투두 내용
 */
const TodoContent = (props: Props) => {
    const [completed, setCompleted] = useState(false)

    const deleteTodo = () => {
        Alert.alert(props.content, "삭제하시겠습니까?",
        [{
            text: "예",
            onPress: () => {}
        },
        {
            text: "아니오",
            onPress: () => null
        }])
    }
    
    useEffect(() => {

    }, [completed])

    useEffect(() => {
        console.log(`시간 ${typeof(props.time)}`)
    }, [])

  return (
        <View style={[styles.hr, {flexDirection: 'row', marginVertical: '3%', paddingHorizontal: '3%',justifyContent:'space-between', alignItems: 'center'}]}>
            <View style={{flexDirection: 'row'}}>
                <CheckBox
                value={completed}
                onValueChange={setCompleted}
                boxType={'square'}
                style={{transform: [{scale: 0.7}]}}
                />
                <View>
                    <Text style={[styles.textLg, completed && styles.completed,]}>{props.content}</Text>
                    {props.time && <Text style={[completed && styles.completed]}>{props.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: undefined })}</Text>}
                </View>
            </View>
            <View style={{flexDirection: 'row'}}>
                {completed && 
                <TouchableOpacity
                onPress={() => deleteTodo()}
                >
                    <Ionicons name="md-trash-outline" size={RFPercentage(2.5)} color={'#c1c1c1'}></Ionicons>
                </TouchableOpacity>}
                <TouchableOpacity
                // style={{marginHorizontal: '1%'}}
                onPress={() => null}
                >
                    <Ionicons name="ellipsis-horizontal-sharp" size={RFPercentage(2.5)} color={'#c1c1c1'}></Ionicons>
                </TouchableOpacity>
            </View>
        </View>
  )
}

export default TodoContent