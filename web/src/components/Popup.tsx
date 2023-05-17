import React from 'react'

type Props = {
    title: string
    children?: any
    onClickConfirmButton?: Function
    onClickOutside: Function
}

const Popup = (props: Props) => {
    return (
        <>
        <div className='popup-outside'
        onClick={() => props.onClickOutside()}></div>
        <div className='popup-container'>
            {/* <div className='popup-title'>
                <span>{props.title}</span>
            </div> */}
            <div className='popup-content over-y'>
                {props.children}
            </div>
            {/* <div className='popup-button'>
                <button onClick={() => props.onClickConfirmButton}>확인</button>
            </div> */}
        </div>
        </>
    )
}

export default Popup