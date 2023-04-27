import express, { Request, Response, NextFunction } from 'express'
import { CallbackError } from 'mongoose'
import { v4 } from 'uuid'
const logger = require("../winston")


const router = express.Router()

// Models
import User from '../DB/model/User'
import Session from '../DB/model/Session'
import Todo from '../DB/model/Todo'

const makeSessionid = (userid: string) => {
    const sessionid = v4()
    const newSession = new Session({
        userid,
        sessionid
    })
    newSession.save((err: CallbackError, data) => {
        if(err){
            logger.error(err)
            return(false)
        }
    })

    return(sessionid)
}

router.get('/', async (req: Request, res: Response) => {
    res.send('login')
})

/*
    ===== POST =====
*/

router.post('/', async (req: Request, res: Response) => {
    logger.info(`login post 쿼리 들어옴 ip: ${req.ip}`)
    logger.info(`id: ${req.body.id}`)
    const userid = req.body.userid
    // ID로 유저 검색 
    const user = await User.findOne({userid: userid})
    console.log(user)
    if(user != null){ // 아이디가 있을 경우
        // 닉네임 및 세션 반환
        res.send({
            nickname: user.nickname,
            sessionid: makeSessionid(userid)
        })
    }else{
        // 없는 아이디
        logger.error('없는 아이디 입니다')
        res.status(404).json({text: "없는 아이디 입니다."}).end()
    }
})

router.post('/signup', async (req: Request, res: Response) => {
    console.log(req.body)
    logger.info(`${req.body} 회원가입`)
    const userid = req.body.userid
    const newUser = new User({
        userid,
        nickname: req.body.nickname
    })

    newUser.save(async (err: CallbackError, data) => {
        if(err){
            logger.error(err)
            res.status(500).end()
        }

        console.log(data.nickname)
        await new Todo({
            userid,
            icon: 'person',
            title: '새 투두',
            todos: [],
            color: ['#f69744', '#e9445d']
        }).save()
        res.send({
            nickname: data.nickname,
            sessionid: makeSessionid(userid)
        })
    })
})

router.post('/logout', async (req: Request, res: Response) => {
    logger.info(`logout post 쿼리 들어옴 ip: ${req.ip}, sessionid: ${req.body.sessionid}`)
    Session.findOneAndDelete({sessionid: req.body.sessionid})
    .then(() => res.status(200).end())
    .catch(err => {logger.error(err)})
})


export default router