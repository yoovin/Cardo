import React, { useEffect, useState } from 'react'
import ProgressBar from "@ramonak/react-progress-bar"
// import {IoAirplane} from "react-icons/io5";
import * as Icons from "react-icons/io5";
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios'
// import icons from '../icons'

import TodoContent from './TodoContent';


type Props = {
    todo: any
}

function TodoCard(props: Props) {
    const queryClient = useQueryClient()
    const [title, setTitle] = useState(props.todo.title)
    // const [icon, setIcon] = useState('')

    const changeTitle = useMutation(
        (option: any) => axios.patch('/todo/change/title', option),
            {
                onSuccess: () => {
                    // 데이터 업데이트 성공 시 캐시를 갱신합니다.
                    queryClient.invalidateQueries("todos")
                },
            }
        )

    useEffect(() => {
    }, [])

    return (
        <div className='todo-card'>
            <div className='todo-info'>
                <div className='icon-container'>
                    {/* <IoAirplane size='35'/> */}
                    {/* {<Icons.IoAccessibility/>} */}
                    {/* {props.todo.icon} */}
                </div>
                <div className='task-num'>
                    <span>0 Tasks</span>
                </div>
                <div className='card-name'>
                    <input type="text" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}/>
                </div>
                <div className='todo-progress'>
                    <ProgressBar 
                    completed={60}
                    // completedClassName="barCompleted"
                    // bgColor=''
                    className="progress"
                    height={'5px'}
                    animateOnRender={true}
                    labelClassName="todo-progress-label"
                    />
                    <span>60%</span>
                </div>
            </div>
            <div className='todo-list'>
                {props.todo.todos.map((item: any, idx:number) => {
                    return <TodoContent key={idx} idx={idx} todo_id={props.todo._id} todo={item}/>
                })}
                

                {/* {props.todo.todos[0] && props.todo.todos[0].date === null && <Text style={styles.dateText}>지정안함</Text>}
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
                            })} */}
            </div>
        </div>
    )
}

export default TodoCard