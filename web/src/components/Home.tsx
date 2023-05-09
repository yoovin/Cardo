import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { dateToString, dateToStringFull } from '../utils'
import TodoCard from './TodoCard'
import Popup from './Popup'

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
            </div>
            <div className='todo-container'>
                {data && data.map((item: any) => (
                    <TodoCard todo={item}/>
                ))}

                <div className='todo-card'>
                    새 투두 추가
                </div>
            </div>
        </div>
    )
}

export default Home