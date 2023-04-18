import { Request, Response, NextFunction, Router} from "express"

const filter = Router()
import Session from "../DB/model/Session"

// 필터되지않을 url
const permit = new Set(['/', '/login', '/login/signup'])

declare global{
    namespace Express{
        interface Request{
            userid: string
        }
    }
} 

/**
 * 
 * @param sessionid 세션아이디
 * @returns userid 혹은 false
 * 세션아이디를 확인해 유저아이디로 넘겨줌
 */
const findUserid = async (sessionid: string) => {
    const session = await Session.findOne({sessionid})
    if(session){
        return session.userid
    }else{
        return false
    }
}

filter.use(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.url)
    console.log(req.header('Authorization'))
    // console.log(req.query)
    try{
        if(req.url.includes('/login')){ // 상관없는 url이면 필터를 거치지 않음
            console.log(`${req.url} 패스됨`)
            return next()
        }

        if(req.header('Authorization')){
            const userid = await findUserid(req.header('Authorization') as string)
            if(userid){
                req.userid = userid
                return next()
            }
        }
        
        // if(req.query.sessionid){
        //     const userid = await findUserid(req.query.sessionid as string)
        //     if(userid){
        //         req.userid = userid
        //         return next()
        //     }
        // }
        
        // if(req.header('Authorization')){
        //     const verifiedToken: JwtPayload = jwt.verify(req.header('Authorization')!, secretKey!) as JwtPayload
        //     if(verifiedToken){
        //         console.log(verifiedToken)
        //         req.userid = verifiedToken.id
        //         return next()
        //     }
        // }
        
        // 토큰이 없거나 불량 토큰일 경우
        return res.status(403).send("로그인이 필요한 서비스입니다.")
    }
    catch(e){
        return next(e)
    }
})

export default filter