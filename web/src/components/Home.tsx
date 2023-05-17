import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { dateToString, dateToStringFull } from '../utils'
import TodoCard from './TodoCard'
import Popup from './Popup'
import { IoAddCircleOutline } from 'react-icons/io5'
import Menu from './Menu'

function Home() {
    const queryClient = useQueryClient()
    const [nickname, setNickname] = useState(localStorage.getItem('nickname'))
    const [profileImage, setProfileImage] = useState('')

    /**
     * 서버에서 투두를 가져온다
     * @returns todos
     */
    const fetchTodos = async () => {
        const res = await axios.get('/todo')
        console.log(res.data)
        return res.data
    }

    const { data, isLoading, isError, error } = useQuery('todos', fetchTodos)

    const addTodoCard = useMutation(
        () => axios.post('/todo/addcard'),
            {
                onSuccess: () => {
                    // 데이터 업데이트 성공 시 캐시를 갱신합니다.
                    queryClient.invalidateQueries("todos")
                }
            }
        )

    useEffect(() => {
        if(localStorage.getItem('profile_image')) setProfileImage(localStorage.getItem('profile_image')!)
    }, [])

    return (
        <div className='container'>
            <div className='top'>
                <div className='profile-image'>
                    {profileImage && <img src={profileImage} alt="" />}
                </div>
                <span className='greeting'>안녕하세요, {nickname}.</span>
                <span className='today'>{dateToStringFull(new Date())}</span>
                <Menu/>
            </div>
            <div className='todo-container'>
                {data && data.map((item: any) => (
                    <TodoCard todo={item}/>
                ))}

                <div className='todo-card center'>
                    <div className='add-card-button center pointer'
                    onClick={() => addTodoCard.mutate()}>
                        <IoAddCircleOutline id='add-card-button-icon'/>
                        <span>투두 카드 추가</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home