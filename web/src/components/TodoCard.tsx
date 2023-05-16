import React, { useEffect, useState } from 'react'
import ProgressBar from "@ramonak/react-progress-bar"
// import {IoAirplane} from "react-icons/io5";
import * as Icons from "react-icons/io";
import * as Icons5 from "react-icons/io5";
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import todoContent from '../interface/todoContent'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { ko } from "date-fns/esm/locale"
// import icons from '../icons'
import { compareDate, isToday, dateToString, dateToStringWithoutYear, dateToStringFull } from '../utils';

import TodoContent from './TodoContent'
import Popup from './Popup';
import Swal from 'sweetalert2';


type Props = {
    todo: any
}


function TodoCard(props: Props) {
    const queryClient = useQueryClient()
    const [title, setTitle] = useState(props.todo.title)
    const [todayTask, setTodayTask] = useState(0)
    const [todayTaskComplete, setTodayTaskComplete] = useState(0)
    const [openPopup, setOpenPopup] = useState(false)
    const [taskContent, setTaskContent] = useState('')
    const [date, setDate] = useState<Date|null>(null)
    const [time, setTime] = useState<Date|null>(null)

    const addIoPrefix = (str: string) => {
        let words = str.split("-");
        words = words.map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
        return "Io" + words.join("");
    }

    /* Your icon name from database data can now be passed as prop */
    const DynamicIcon = ({ name }: any) => {
        const IconComponent = Icons[name as keyof typeof Icons]
        const IconComponent5 = Icons5[name as keyof typeof Icons5]

        if (IconComponent) { // Return a default one
            return <IconComponent size={30} color={props.todo.color[0]}/>
        }else if(IconComponent5){
            return <IconComponent5 size={30} color={props.todo.color[0]}/>
        }
        return <div></div>
    }

    const changeTitle = useMutation(
        (option: any) => axios.patch('/todo/change/title', option),
            {
                onSuccess: () => {
                    // 데이터 업데이트 성공 시 캐시를 갱신합니다.
                    queryClient.invalidateQueries("todos")
                },
            }
        )


    const addTaskMutation = useMutation(
        (task: any) => axios.post('/todo/addtask', task),
            {
                onSuccess: () => {
                    // 데이터 업데이트 성공 시 캐시를 갱신합니다.
                    queryClient.invalidateQueries("todos")
                    setOpenPopup(false)
                },
            }
        )

    const addTask = () => {
        const task: any = {
            id: props.todo._id,
            task: taskContent,
        }

        if(date){
            task.date = date
        }
        
        if(time){
            task.time = time
        }
        addTaskMutation.mutate(task)
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
        console.log(addIoPrefix(props.todo.icon))
    }, [])

    useEffect(() => {
        // 오늘 할일 개수 체크
        checkTodayTask()
        console.log('todo 변경됨')
    }, [props.todo])

    useEffect(() => {
        // AddTask 팝업 닫을 때 값 초기화
        if(!openPopup){
            setTaskContent('')
            setDate(null)
            setTime(null)
        }
    }, [openPopup])
    

    return (
        <>
        <div className='todo-card'>
            <div className='todo-info'>
                <div className='icon-container'>
                    <DynamicIcon name={addIoPrefix(props.todo.icon)}/>
                </div>
                <div className='task-num'>
                    <span>{todayTask} Tasks</span>
                </div>
                <div className='card-name'>
                    <input type="text" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onBlur={() => changeTitle.mutate({id: props.todo._id, title})}
                    />
                </div>
                <div className='todo-progress'>
                    <ProgressBar 
                    completed={(todayTask > 0 && todayTaskComplete > 0 ? todayTaskComplete / todayTask : 0)*100}
                    // completedClassName="barCompleted"
                    bgColor={props.todo.color[0]}
                    className="progress"
                    height={'5px'}
                    animateOnRender={true}
                    labelClassName="todo-progress-label"
                    />
                    <span>{todayTask > 0 && todayTaskComplete > 0 ? Math.ceil((todayTaskComplete / todayTask) * 100) : 0}%</span>
                </div>
                <button className='add-task-button'
                onClick={() => setOpenPopup(true)}>
                    + 새 할일 추가
                </button>
            </div>
            <div className='todo-list'>
                {props.todo.todos[0] && props.todo.todos[0].date === null && <span className='date-text'>지정안함</span>}
                            {props.todo.todos.map((item: todoContent, idx:number) => {
                                // date가 null이거나 지정된 날짜와 같은 경우(이전 컨텐츠와 같은 날짜)면 날짜를 표시하지않고 넘어감.
                                if(compareDate(currentDate, new Date(item.date)) || item.date === null){
                                    return <TodoContent key={idx} idx={idx} todo_id={props.todo._id} todo={item}/>
                                }else{
                                    // 만약 이전 컨텐츠의 날짜와 다른 경우 날짜를 바꿔주고 표시함.
                                    currentDate = new Date(item.date)
                                    // 오늘 날짜의 투두는 '오늘'이라고 개별 표시
                                    if(isToday(currentDate)){
                                        return(<>
                                            <span className='date-text'>오늘</span>
                                            <TodoContent key={idx} idx={idx} todo_id={props.todo._id} todo={item}/>
                                            </>)
                                    }else{
                                        return(<>
                                            <span className='date-text'>
                                                {currentDate.getFullYear() === new Date().getFullYear() 
                                                ? 
                                                    dateToStringWithoutYear(currentDate, true) 
                                                :   
                                                    dateToStringFull(currentDate)}
                                            </span>
                                            <TodoContent key={idx} idx={idx} todo_id={props.todo._id} todo={item}/>
                                            </>)
                                    }
                                }
                            })}
            </div>
        </div>
        {openPopup && 
        <Popup title="" onClickOutside={() => setOpenPopup(false)}>
            <div className='add-task-container center'>
                <span className='add-task-text'>어떤 멋진 일을 계획하고 있나요?</span>
                <input type="text" value={taskContent} onChange={e => setTaskContent(e.target.value)}/>
                <div className='date-selector'>
                    <div>
                        <Icons5.IoCalendarSharp/>
                        날짜
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
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <Icons5.IoTimeOutline/>
                        시간
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
                        />
                    </div>
                </div>

                <div className='add-task-button' onClick={() => {
                    if(taskContent.length > 0){
                        addTask()
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: '할일은 1글자 이상 적어주세요.',
                            // text: '이곳은 내용이 나타나는 곳입니다.',
                        });
                    }

                    }}>
                    완료
                </div>
            </div>
        </Popup>}
        
        </>
    )
}

export default TodoCard