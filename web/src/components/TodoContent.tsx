import React, { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { IoEllipsisHorizontalSharp, IoTrashOutline } from 'react-icons/io5'
import Swal from 'sweetalert2'


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

    const deleteTodo = (text: string) => {
        Swal.fire({
            title: `'${text}'를 삭제하시겠습니까?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            reverseButtons: true,
        })
        .then(result => {
            if(result.isConfirmed){
                deleteContent.mutate({params:{id: props.todo_id, index: props.todo.index}})
            }
        })
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
        <div className='todo-content'>
            <div className={`todo-task ${completed ? 'completed' : ''}`}>
                <input type="checkbox"
                className='todo-checkbox'
                checked={completed}
                onChange={e => {
                    setCompleted(e.target.checked)
                    checkTodo(e.target.checked)
                }}/>
                <div className='task-container'>
                    {completed ? <span className='task-text'>{task}</span> :
                    <input type="text" 
                        className='task-text'
                        value={task}
                        onChange={e => setTask(e.target.value)}
                        onBlur={() => changeTask.mutate({id: props.todo_id, index: props.todo.index, task})}
                        />
                    }
                    {props.todo.time && <span className='time-text'>{new Date(props.todo.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: undefined })}</span>}
                </div>
            </div>
            <div className='todo-icons'>
                {completed && 
                <button className='icon-button'
                onClick={() => deleteTodo(task)}>
                    <IoTrashOutline className='todo-icon'/>
                </button>}
                <IoEllipsisHorizontalSharp className='todo-icon'/>
            </div>
        </div>
        <hr/>
        </>
    )
}

export default TodoContent