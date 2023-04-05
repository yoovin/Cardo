import {atom} from 'recoil'

// 날짜
export const isSigned = atom({
    key: 'isSigned',
    default: false
})

export const currentUserid = atom({
    key: 'currentUserid',
    default: ''
})

export const currentUsername = atom({
    key: 'currentUsername',
    default: ''
})

export const currentUserImageUri = atom({
    key: 'currentUserImageUri',
    default: ''
})

export const titleText = atom({
    key: 'titleText',
    default: ''
})

export const isAddTaskFullScreen = atom({
    key: 'isAddTaskFullScreen',
    default: false
})