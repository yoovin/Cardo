import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'


const app = express()
const port: number = 1234
dotenv.config()

// Routers
import sessionFilter from './Routers/sessionFilter'
import loginRouter from './Routers/loginRouter'
import todoRouter from './Routers/todoRouter'



// Database
import connectDB from './DB/connectDB';

connectDB()


app.listen(port, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: ${port}🛡️
    ###############################################
    `)


    app.use(bodyParser.json())
    app.use(cookieParser())
    app.use(cors({
        origin: true, // 출처 허용 옵션
        credentials: true // 사용자 인증이 필요한 리소스 접근에 필요함
    }))
    app.use(express.json({ limit: '50mb' }))
    app.use(express.urlencoded({ limit: '50mb', extended: true }))

    app.get('/', (req: Request, res: Response) => {
        res.send("서버 잘 돈다")
    })

    /*
        ===== JWT Filter =====
    */
    app.use(sessionFilter)

    /*
        ===== 로그인 및 회원가입 =====
    */
    app.use('/login', loginRouter)

    app.use('/todo', todoRouter)


});