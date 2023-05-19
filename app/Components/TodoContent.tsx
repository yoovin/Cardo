import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from '../styles'
import CheckBox from '@react-native-community/checkbox'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {RFPercentage} from "react-native-responsive-fontsize"
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

//시간변경
//날짜변경
//할일변경

type Props = {
    todo_id: string
    todo: any
    setModalVisible: Function
    setCurrentTask: Function
    setCurrentIndex: Function
    setDate: Function
    idx: number
}

/**
 * 
 * @param props 
 * @returns 투두 내용
 */
const TodoContent = (props: Props) => {
    const queryClient = useQueryClient()
    const [task, setTask] = useState(props.todo.task)
    const [completed, setCompleted] = useState(props.todo.is_complete)

    const deleteTodo = () => {
        Alert.alert(props.todo.task, "삭제하시겠습니까?",
        [{
            text: "삭제",
            onPress: () => {deleteContent.mutate({params:{id: props.todo_id, index: props.todo.index}})}
        },
        {
            text: "취소",
            onPress: () => null
        }])
    }

    const checkTodo = (val: boolean) => {
        checkContent.mutate({id: props.todo_id, index: props.todo.index, isComplete: val})
    }
    
    
    const deleteContent = useMutation(
            (option: any) => axios.delete('/todo/delete/task', option),
            {
                onSuccess: () => {
                    // 데이터 업데이트 성공 시 캐시를 갱신합니다.
                    queryClient.invalidateQueries("todos")
                },
            }
        )

    const checkContent = useMutation(
        (option: any) => axios.patch('/todo/change/check', option),
        {
            onSuccess: () => {
                // 데이터 업데이트 성공 시 캐시를 갱신합니다.
                queryClient.invalidateQueries("todos")
            },
        }
    )

    const changeTask = useMutation(
        (option: any) => axios.patch('/todo/change/task', option),
        {
            onSuccess: () => {
                // 데이터 업데이트 성공 시 캐시를 갱신합니다.
                queryClient.invalidateQueries("todos")
            },
        }
    )

    //     useEffect(() => {
            
    //     }, [completed])
        
    useEffect(() => {
        // console.log(`시간 ${typeof(props.todo.time)}`)
        setTask(props.todo.task)
        setCompleted(props.todo.is_complete)
    }, [props.todo])

  return (
    <>
        <View style={[{flexDirection: 'row', marginVertical: 10, paddingHorizontal: 10, justifyContent:'space-between', alignItems: 'center'}]}>
            <View style={{flexDirection: 'row'}}>
                <CheckBox
                value={completed}
                onValueChange={(val) => {
                    checkTodo(val)
                    setCompleted(val)
                }}
                boxType={'square'}
                style={{transform: [{scale: 0.7}]}}
                onCheckColor='#c1c1c1'
                onTintColor='#c1c1c1'
                />
                <View>
                    <TextInput style={[styles.textLg, completed && styles.completed,]}
                    value={task}
                    onChangeText={setTask}
                    editable={!completed}
                    onBlur={() => {
                        changeTask.mutate({id: props.todo_id, index: props.todo.index, task})
                    }}/>
                    {props.todo.time && <Text style={[completed && styles.completed]}>{new Date(props.todo.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: undefined })}</Text>}
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
                onPress={() => {
                    props.setModalVisible(true)
                    props.setCurrentTask(props.todo.content)
                    props.setCurrentIndex(props.idx)
                    if(props.todo.date){
                        props.setDate(new Date(props.todo.date))
                    }

                    if(props.todo.time){
                        props.setDate(new Date(props.todo.time))
                    }
                    
                }}
                >
                    <Ionicons name="ellipsis-horizontal-sharp" size={RFPercentage(2.5)} color={'#c1c1c1'}></Ionicons>
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.hr}>

        </View>
    </>
  )
}

export default TodoContent