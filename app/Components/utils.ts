

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
export const dateToStringFull = (date: Date, language: string) => {
    let strDate = 
    language === 'en' && `${dayEN[date.getDay()]}day, ${monthEn[date.getMonth()]}, ${date.getDate()}, ${date.getFullYear()}` || 
    language === 'ko' && `${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일 ${dayKO[date.getDay()]}요일` || 
    language === 'ja' && `${date.getFullYear()}年 ${date.getMonth()+1}月 ${date.getDate()}日 ${dayJA[date.getDay()]}曜日`
    return strDate
}

export const dateToString = (date: Date, language: string) => {
    let strDate = 
    language === 'en' && `${monthEn[date.getMonth()]}, ${date.getDate()}, ${date.getFullYear()}` || 
    language === 'ko' && `${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일` || 
    language === 'ja' && `${date.getFullYear()}年 ${date.getMonth()+1}月 ${date.getDate()}日`
    return strDate
}

export const dateToStringWithoutYear = (date: Date, language: string) => {
    let strDate = 
    language === 'en' && `${monthEn[date.getMonth()]}, ${date.getDate()}` || 
    language === 'ko' && `${date.getMonth()+1}월 ${date.getDate()}일` || 
    language === 'ja' && `$${date.getMonth()+1}月 ${date.getDate()}日`
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