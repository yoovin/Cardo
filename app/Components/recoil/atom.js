import {atom} from 'recoil'

// 날짜
export const isSigned = atom({
    key: 'isSigned',
    default: false
})

export const Nickname = atom({
    key: 'Nickname',
    default: ''
})

export const Sessionid = atom({
    key: 'Sessionid',
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

export const isMenuShow = atom({
    key: 'isMenuShow',
    default: false
})

export const Language = atom({
    key: 'language',
    default: 'ko'
})

export const ProfileImage = atom({
    key: 'ProfileImage',
    default: ''
})