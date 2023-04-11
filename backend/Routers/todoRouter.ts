import express, { Request, Response, NextFunction } from 'express'
import { CallbackError } from 'mongoose'


const router = express.Router()

// Models
import Todo from '../DB/model/Todo'

router.get('/', async (req: Request, res: Response) => {
    console.log(`login post 쿼리 들어옴 ip: ${req.ip}`)
    // console.log(`id: ${req.body.id}`)
    Todo.findOne({userid: req.userid})
    .then(data => res.send(data))
    .catch(err => console.error(err))
})

/*
    ===== POST =====
*/

// router.post('/addtodo', async (req: Request, res: Response) => {
//     new Todo({

//     })
// })


export default router