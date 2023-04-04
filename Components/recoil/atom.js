import {atom} from 'recoil'

// 날짜
export const date = atom({
    key: 'date',
    default: ''
})

export const currentUserid = atom({
    key: 'currentUserid',
    default: ''
})

export const currentUserInfo = atom({
    key: 'currentUserInfo',
    default:{}
})