

const monthEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const dayEN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const dayKO = ['일', '월', '화', '수', '목', '금', '토']
const dayJA = ['日', '月', '火', '水', '木', '金', '土']
/**
 * 
 * @param date
 * @param language
 * @returns language에 맞는 언어로 바뀐 날짜 출력
*/
export const dateToStringFull = (date: Date) => {
    let strDate = `${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일 ${dayKO[date.getDay()]}요일`    
    return strDate
}

export const dateToString = (date: Date, isShowDay?: boolean) => {
    let strDate = `${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일`
    if(isShowDay){
        return strDate + ' ' + dayKO[date.getDay()] + '요일'
    }
    return strDate
}

export const dateToStringWithoutYear = (date: Date, isShowDay?: boolean) => {
    let strDate = `${date.getMonth()+1}월 ${date.getDate()}일`
    if(isShowDay){
        return strDate + ' ' + dayKO[date.getDay()] + '요일'
    }
    return strDate
}

export const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
}

/**
 * 
 * @param date1 비교할 Date
 * @param date2 비교할 Date
 * @returns 같은날인지 여부 true/false
 */
export const compareDate = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
     date1.getMonth() === date2.getMonth() &&
     date1.getFullYear() === date2.getFullYear()
}