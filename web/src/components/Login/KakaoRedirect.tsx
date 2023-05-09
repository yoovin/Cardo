import React, { useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { GetCert, isSigned, Nickname, Sessionid, Userid } from '../recoil/atom'
import { UserInfo } from '../../interface/customTypes'


type Props = {
}

const KakaoRedirect = (props: Props) => {
    // const setGetCert = useSetRecoilState(GetCert)
    const [getCert, setGetCert] = useRecoilState(GetCert)
    const setUserid = useSetRecoilState(Userid)

    // 리다이렉트 된 url에서 code 추출
    const currentUrl = new URL(window.location.href)
    const code = currentUrl.searchParams.get('code')

    /**
     * kakao api로 받아온 유저 정보 토큰 리턴
     * @returns 유저 정보 토큰
     */
    const getKakaoToken = async () => {
        try {
            const res = await axios.post('https://kauth.kakao.com/oauth/token', {
                grant_type: 'authorization_code',
                client_id: process.env.REACT_APP_KAKAO_REST_KEY,
                redirect_uri: process.env.REACT_APP_KAKAO_REDIRECT_URL,
                code,
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
            })
            return res.data.id_token
        } catch (err) {
            alert(`문제가 발생했습니다. ${err}`)
            console.error(err)
        }
    }

    const kakaoLogin = async () => {
        console.log('kakao로그인')
        const idToken = await getKakaoToken()
        /**
         * {
         * aud:"da83c8f927ba0624d72379a5e6b7705d"
         * auth_time: 1683560641
         * exp: 1683582241
         * iat: 1683560641
         * iss: "https://kauth.kakao.com"
         * nickname: "유빈"
         * picture: "http://k.kakaocdn.net/dn/HOyXD/btsd4GVqICs/PKZ3hkBdr0pAajUs8mtanK/img_110x110.jpg"
         * sub: "2734566318"
         * }
         */
        const userInfo: UserInfo = jwt_decode(idToken)
        localStorage.setItem('profile_image', userInfo.picture)
        localStorage.setItem('how_log', 'kakao')
        setUserid(userInfo.sub)
        otherWindow.postMessage({sign: 'userid', userid: userInfo.sub}, '*');
        window.close()
    }

    const otherWindow = window.opener || window.parent;

    useEffect(() => {
        kakaoLogin()
    }, [])

    return (
        <div>KakaoRedirect</div>
    )
}

export default KakaoRedirect