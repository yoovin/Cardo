import React, { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { IoEllipsisHorizontalSharp, IoTrashOutline } from 'react-icons/io5'

//시간변경
//날짜변경
//할일변경

type Props = {
    todo_id: string
    todo: any
    // setModalVisible: Function
    // setCurrentTask: Function
    // setCurrentIndex: Function
    // setDate: Function
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
        // Alert.alert(props.todo.task, "삭제하시겠습니까?",
        // [{
        //     text: "삭제",
        //     onPress: () => {deleteContent.mutate({params:{id: props.todo_id, index: props.todo.index}})}
        // },
        // {
        //     text: "취소",
        //     onPress: () => null
        // }])
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
        <div className='todo-content'>
            <input type="checkbox" name="" id="" />
            <span>{task}</span>
            <IoTrashOutline/>
            <IoEllipsisHorizontalSharp/>
        </div>
    )
}

export default TodoContent