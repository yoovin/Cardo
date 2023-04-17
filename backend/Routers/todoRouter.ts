import express, { Request, Response, NextFunction } from 'express'
import { CallbackError } from 'mongoose'


const router = express.Router()

// Models
import Todo from '../DB/model/Todo'
import getNextSequence from '../DB/getNextSequence'

router.get('/', async (req: Request, res: Response) => {
    console.log(`login post 쿼리 들어옴 ip: ${req.ip}`)
    // console.log(`id: ${req.body.id}`)
    Todo.find({userid: req.userid})
    .then(data => res.send(data))
    .catch(err => console.error(err))
})

/*
    ===== POST =====
*/

router.post('/addtask', async (req: Request, res: Response) => {
    // Todo.findOneAndUpdate(
    //     {_id: req.body.card_id},
    //     {$set:{}}
    // )

    console.log(req.body)
    const index = await getNextSequence(req.body.id)
    const {content, date, time} = req.body
    const todoCard = await Todo.findById(req.body.id)
    todoCard!.todos.push({index, content, is_complete: false, date, time})
    todoCard!.save(async (err: CallbackError, data) => {
        if(err){
            console.error(err)
            res.status(500).end()
        }
        res.status(201).end()
    })
})


// 아이콘 변경
router.put('/change/icon', async (req: Request, res: Response) => {
    // _id: 타겟
    await Todo.findOneAndUpdate(
        {_id: req.body.id},
        {$set:{icon: req.body.icon}}
    ).exec()
    res.status(200).end()
})

// 색상 변경
router.put('/change/color', async (req: Request, res: Response) => {
    await Todo.findOneAndUpdate(
        {_id: req.body.id},
        {$set:{color: req.body.color}}
    ).exec()
    res.status(200).end()
})

export default router