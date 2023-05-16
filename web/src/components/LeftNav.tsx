import React, { useState } from 'react'
import { IoIosMenu } from 'react-icons/io'

type Props = {}

const LeftNav = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false)


    return (
        <>
        <div className='nav-icon'
        onClick={() => setIsOpen(!isOpen)}
        >
            <IoIosMenu/>
        </div>
        <div className={`menu-container ${!isOpen ? 'hidden' : ''}`}>
            <div className='menu'>
                로그아웃
            </div>
        </div>
        </>
    )
}

export default LeftNav