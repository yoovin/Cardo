import express, { Request, Response, NextFunction } from 'express'
import { CallbackError } from 'mongoose'


const router = express.Router()

// Models
import Todo from '../DB/model/Todo'
import getNextSequence from '../DB/getNextSequence'

router.get('/', async (req: Request, res: Response) => {
    console.log(`Todo get 쿼리 들어옴 ip: ${req.ip}`)
    // console.log(`id: ${req.body.id}`)
    Todo.find({userid: req.userid})
    .then(data => {
        res.send(data)
    })
    .catch(err => console.error(err))
})

/*
    ===== POST =====
*/

/**
 *  투두 카드 추가
 */
router.post('/addcard', async (req: Request, res: Response) => {
    console.log(req.body)
    await new Todo({
        userid: req.userid,
        icon: 'person',
        title: '새 투두',
        todos: [],
        color: ['#f69744', '#e9445d']
    }).save()
    .then(() => res.status(201).end())
    .catch(err => {
        res.status(500).end()
        console.error(err)
    })
})

/**
 *  할일 추가
 */
router.post('/addtask', async (req: Request, res: Response) => {
    console.log(req.body)
    const index = await getNextSequence(req.body.id)
    const {task, date, time} = req.body
    await Todo.findOneAndUpdate(
        {_id: req.body.id},
        {$push:{
            todos: {
                $each: [{index, task, is_complete: false, date, time}], // 추가할 데이터
                $sort: { date: 1 } // date 필드 기준으로 오름차순 정렬
            }
        }}
    ).exec()
    .then(() => res.status(201).end())
    .catch(err => {
        res.status(500).end()
        console.error(err)
    })
})

/*
    ===== PATCH =====
*/

/**
 *  카드 제목 변경
 */
router.patch('/change/title', async (req: Request, res: Response) => {
    await Todo.findOneAndUpdate(
        {_id: req.body.id},
        {$set:{title: req.body.title}}
    ).exec()
    .then(() => res.status(200).end())
    .catch(err => {
        res.status(500).end()
        console.error(err)
    })
})

/**
 *  카드 아이콘 변경
 */
router.patch('/change/icon', async (req: Request, res: Response) => {
    // _id: 타겟
    await Todo.findOneAndUpdate(
        {_id: req.body.id},
        {$set:{icon: req.body.icon}}
    ).exec()
    res.status(200).end()
})

/**
 *  카드 색상 변경
 */
router.patch('/change/color', async (req: Request, res: Response) => {
    await Todo.findOneAndUpdate(
        {_id: req.body.id},
        {$set:{color: req.body.color}}
    ).exec()
    res.status(200).end()
})

/**
 *  투두 체킹
 */
router.patch('/change/check', async (req: Request, res: Response) => {
    console.log('투두 체크 들어옴')
    console.log(req.body)
    await Todo.updateOne(
        {_id: req.body.id, 'todos.index': req.body.index},
        {$set:{'todos.$.is_complete': req.body.isComplete}}
    ).exec()
    res.status(200).end()
})

/**
 *  할일 변경
 */
router.patch('/change/task', async (req: Request, res: Response) => {
    console.log('할일 변경 들어옴')
    console.log(req.body)
    await Todo.updateOne(
        {_id: req.body.id, 'todos.index': req.body.index},
        {$set:{'todos.$.task': req.body.task}}
    ).exec()
    res.status(200).end()
})

/**
 *  날짜 변경
 */
router.patch('/change/date', async (req: Request, res: Response) => {
    console.log('날짜 변경 들어옴')
    console.log(req.body)
    await Todo.updateOne(
        {_id: req.body.id, 'todos.index': req.body.index},
        {$set:{'todos.$.date': req.body.date}}
    ).exec()
    res.status(200).end()
})

/**
 *  시간 변경
 */
router.patch('/change/time', async (req: Request, res: Response) => {
    console.log('시간 변경 들어옴')
    console.log(req.body)
    await Todo.updateOne(
        {_id: req.body.id, 'todos.index': req.body.index},
        {$set:{'todos.$.time': req.body.time}}
    ).exec()
    res.status(200).end()
})

/*
    ===== DELETE =====
*/

/**
 *  할일 삭제
 */
router.delete('/delete/task', async (req: Request, res: Response) => {
    console.log('할일 삭제 들어옴')
    console.log(req.query.id)
    await Todo.findByIdAndUpdate(
        {_id: req.query.id},
        {$pull: {'todos': {'index': Number(req.query.index)}}},
        {new: true}
    ).exec()
    .then((data) => {
        res.status(200).end()})
    .catch(err => {
        res.status(500).end()
        console.error(err)
    })
})

export default router