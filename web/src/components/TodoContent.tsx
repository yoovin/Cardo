import React, { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { IoEllipsisHorizontalSharp, IoTrashOutline } from 'react-icons/io5'
import Swal from 'sweetalert2'
import * as Icons5 from "react-icons/io5";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { ko } from "date-fns/esm/locale"

import Popup from './Popup'


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

    const [openPopup, setOpenPopup] = useState(false)
    const [date, setDate] = useState<Date|null>(null)
    const [time, setTime] = useState<Date|null>(null)

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


        // useEffect(() => {
            
        // }, [completed])
        
    useEffect(() => {
        setTask(props.todo.task)
        setCompleted(props.todo.is_complete)
    }, [props.todo])

    useEffect(() => {
        // 할일 수정 팝업 닫을 때 값 초기화

        if(!openPopup){
            setDate(null)
            setTime(null)
        }else{
            if(props.todo.date){
                setDate(new Date(props.todo.date))
            }

            if(props.todo.time){
                setTime(new Date(props.todo.time))
            }
        }
    }, [openPopup])

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
                    <input type="text" 
                        className={`task-text ${completed ? 'completed' : ''}`}
                        value={task}
                        onChange={e => setTask(e.target.value)}
                        onBlur={() => changeTask.mutate({id: props.todo_id, index: props.todo.index, task})}
                        />
                    {props.todo.time && <span className='time-text'>{new Date(props.todo.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: undefined })}</span>}
                </div>
            </div>
            <div className='todo-icons'>
                {completed && 
                    <IoTrashOutline className='todo-icon'onClick={() => deleteTodo(task)}/>
                // <button className='icon-button'
                // 
                // </button>
            }

<IoEllipsisHorizontalSharp className='todo-icon' onClick={() => setOpenPopup(true)}/>
                {/* <button className='icon-button'
                </button> */}
                
            </div>
        </div>
        {/* 새 할일 팝업 */}
        {openPopup && 
        <Popup title="" onClickOutside={() => setOpenPopup(false)}>
            <div className='center'>
                <span className='font-bold'>할일 수정</span>
            </div>
            <div className='add-task-container center'>
                <div className='date-selector'>
                    <div className='center-h'>
                        <Icons5.IoCalendarSharp size={30}/>
                        <span className='text-lg font-bold'>날짜</span>
                    </div>
                    <div>
                    <DatePicker
                        selected={date}
                        onChange={(date: Date | null) => {
                            setDate(date!)
                        }}
                        placeholderText="지정안함"
                        dateFormat="yyyy-MM-dd"
                        locale={ko}
                        className='datepicker'
                        />
                    </div>
                </div>
                <div>
                    <div className='center-h'>
                        <Icons5.IoTimeOutline size={30}/>
                        <span className='text-lg font-bold'>시간</span>
                    </div>
                    <div>
                    <DatePicker
                        selected={time}
                        onChange={(date: Date | null) => {
                            setTime(date!)
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="hh:mm"
                        placeholderText="지정안함"
                        locale={ko}
                        className='datepicker'
                        />
                    </div>
                </div>

                <div className='add-task-button' onClick={() => {
                    changeDate.mutate({...props.todo, id: props.todo_id, date, time})
                    setOpenPopup(false)
                    }}>
                    완료
                </div>
            </div>
        </Popup>}
        <hr/>
        </>
    )
}

export default TodoContent