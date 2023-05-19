import {atom} from 'recoil'

// 날짜
export const isSigned = atom({
    key: 'isSigned',
    default: false
})

// 로그인 중 소셜api 인증받았는지 여부
export const GetCert = atom({
    key: 'GetCert',
    default: false
})

export const Userid = atom({
    key: 'Userid',
    default: ''
})

export const ProfileImage = atom({
    key: 'ProfileImage',
    default: ''
})

export const Nickname = atom({
    key: 'Nickname',
    default: ''
})

export const Sessionid = atom({
    key: 'Sessionid',
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
