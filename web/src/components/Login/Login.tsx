import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { GetCert, isSigned, Nickname, Sessionid, Userid } from '../recoil/atom'
import Popup from '../Popup'

function Login() {
    const setSessionid = useSetRecoilState(Sessionid)
    const setNickname = useSetRecoilState(Nickname)
    const setSigned = useSetRecoilState(isSigned)
    const [onEnterNicknamePopup, setOnEnterNicknamePopup] = useState(false)
    const [userName, setUserName] = useState('')
    const [userid, setUserid] = useState('')

    const openKakaoLogin = () => {
        const restApiKey = process.env.REACT_APP_KAKAO_REST_KEY
        const redirectUrl = process.env.REACT_APP_KAKAO_REDIRECT_URL

        const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUrl}&response_type=code`

        window.open(kakaoURL, 'window_name','width=430,height=700,location=no,status=no,scrollbars=yes')
        // window.open(kakaoURL)
    }

    /**
     * 
     * @param userid 
     * @param nickname 
     * 로그인이 처음 일 경우 회원가입
     */
    const signup = async(userid: string, nickname: string) => {
        axios.post('/login/signup', {
            userid,
            nickname
        })
        .then(async res => {
            localStorage.setItem('nickname', res.data.nickname)
            localStorage.setItem('sessionid', res.data.sessionid)

            setNickname(res.data.nickname)
            setSessionid(res.data.sessionid)
            setSigned(true)
        })
        .catch(err => alert(`문제가 발생했습니다. ${err}`))
    }

    /**
     * 
     * @param userid 
     * 각 소셜로그인으로 받아 온 아이디로 로그인함
     */
    const login = async (userid: string) => {
        axios.post('/login', {userid}, {validateStatus: (status) => (status < 500)})
        .then(async res => {
            if(res.status === 200){
                localStorage.setItem('nickname', res.data.nickname)
                localStorage.setItem('sessionid', res.data.sessionid)
                
                setNickname(res.data.nickname)
                setSessionid(res.data.sessionid)
                setSigned(true)
            }else if(res.status === 404){
                // 회원가입 시 유저 아이디
                setUserid(userid)
                setOnEnterNicknamePopup(true)
            }
        })
        .catch(err => alert(`문제가 발생했습니다. ${err}`))
    }

    const handleMessage = (event:any) => {
        // event.data에 수신한 메시지가 담겨 있습니다.
        if(event.data.sign === 'userid'){
            // userid를 받아오면 로그인
            login(event.data.userid)
            console.log(event.data.userid)
        }
      };

    useEffect(() => {
        // 유저 아이디를 받아올 이벤트 리스너 등록
        window.addEventListener('message', handleMessage);
    
        // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거
        return () => {
          window.removeEventListener('message', handleMessage);
        };
      }, [])
    

  return (
    <div className='container'>
        <button onClick={openKakaoLogin}>카카오 로그인</button>
        <div>Login</div>

        {onEnterNicknamePopup &&
        <Popup title="이름을 알려주세요" onClickConfirmButton={() => signup(userid, userName)}>
            <div>나중에 변경 가능해요.</div>
            <input type="text" value={userName} onChange={e => setUserName(e.target.value)}/>
        </Popup>}
    </div>
  )
}

export default Login