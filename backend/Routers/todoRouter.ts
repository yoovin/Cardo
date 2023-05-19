import express, { Request, Response, NextFunction } from 'express'
import { CallbackError } from 'mongoose'
const logger = require("../winston")

const router = express.Router()

// Models
import Todo from '../DB/model/Todo'
import getNextSequence from '../DB/getNextSequence'

router.get('/', async (req: Request, res: Response) => {
    logger.info(`Todo get 쿼리 들어옴 ip: ${req.ip}`)
    Todo.find({userid: req.userid})
    .then(async data => {
        res.send(data)
    })
    .catch(err => logger.error(err))
})

/*
    ===== POST =====
*/

/**
 *  투두 카드 추가
 */
router.post('/addcard', async (req: Request, res: Response) => {
    logger.info(`todo카드 추가 ${JSON.stringify(req.body)}`)
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
        logger.error(err)
    })
})

/**
 *  할일 추가
 */
router.post('/addtask', async (req: Request, res: Response) => {
    logger.info(`할일 추가 ${JSON.stringify(req.body)}`)
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
        logger.error(err)
    })
})

/*
    ===== PATCH =====
*/

/**
 *  카드 제목 변경
 */
router.patch('/change/title', async (req: Request, res: Response) => {
    logger.info(`카드 제목 변경 ${JSON.stringify(req.body)}`)
    await Todo.findOneAndUpdate(
        {_id: req.body.id},
        {$set:{title: req.body.title}}
    ).exec()
    .then(() => res.status(200).end())
    .catch(err => {
        res.status(500).end()
        logger.error(err)
    })
})

/**
 *  카드 아이콘 변경
 */
router.patch('/change/icon', async (req: Request, res: Response) => {
    logger.info(`카드 아이콘 변경 ${JSON.stringify(req.body)}`)
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
    logger.info(`카드 색상 변경 ${JSON.stringify(req.body)}`)
    await Todo.findOneAndUpdate(
        {_id: req.body.id},
        {$set:{color: req.body.color}}
    ).exec()
    res.send({'color': req.body.color})
})

/**
 *  투두 체킹
 */
router.patch('/change/check', async (req: Request, res: Response) => {
    logger.info(`할일 체크 ${JSON.stringify(req.body)}`)
    await Todo.updateOne(
        {_id: req.body.id, 'todos.index': req.body.index},
        {$set:{'todos.$.is_complete': req.body.isComplete}}
    ).exec()
    .then(() => {
        res.status(200).end()})
    .catch(err => {
        res.status(500).end()
        logger.error(err)
    })
})

/**
 *  할일 변경
 */
router.patch('/change/task', async (req: Request, res: Response) => {
    logger.info(`할일 변경 ${JSON.stringify(req.body)}`)
    await Todo.updateOne(
        {_id: req.body.id, 'todos.index': req.body.index},
        {$set:{'todos.$.task': req.body.task}}
    ).exec()
    .then(() => {
        res.status(200).end()})
    .catch(err => {
        res.status(500).end()
        logger.error(err)
    })
})

/**
 *  날짜 변경
 */
router.patch('/change/date', async (req: Request, res: Response) => {
    logger.info(`할일 날짜 변경 ${JSON.stringify(req.body)}`)
    const {task, date, time, index, is_complete} = req.body
    Todo.findByIdAndUpdate(
        {_id: req.body.id},
        {$pull: {'todos': {'index': Number(index)}}},
    ).exec().then(() => {
        logger.info('할일추가')
        Todo.findOneAndUpdate(
            {_id: req.body.id},
            {$push:{
                todos: {
                    $each: [{index, task, is_complete, date, time}], // 추가할 데이터
                    $sort: { date: 1 } // date 필드 기준으로 오름차순 정렬
                }
            }}
        ).exec()
        .then(() => {
            logger.info('200보냄')
            res.status(201).end()
        })
        .catch(err => {
            res.status(500).end()
            logger.error(err)
        })
    })
    
    
        // res.status(200).end()
})

/**
 *  시간 변경
 */
router.patch('/change/time', async (req: Request, res: Response) => {
    logger.info(`할일 시간 변경 ${JSON.stringify(req.body)}`)
    await Todo.updateOne(
        {_id: req.body.id, 'todos.index': req.body.index},
        {$set:{'todos.$.time': req.body.time}}
    ).exec()
    .then(() => {
        res.status(200).end()})
    .catch(err => {
        res.status(500).end()
        logger.error(err)
    })
})

/*
    ===== DELETE =====
*/

/**
 *  할일 삭제
 */
router.delete('/delete/task', async (req: Request, res: Response) => {
    logger.info(`할일 삭제 ${JSON.stringify(req.query)}`)
    await Todo.findByIdAndUpdate(
        {_id: req.query.id},
        {$pull: {'todos': {'index': Number(req.query.index)}}},
    ).exec()
    .then(() => {
        res.status(200).end()})
    .catch(err => {
        res.status(500).end()
        logger.error(err)
    })

/**
 *  투두카드 삭제
 */
router.delete('/delete/card', async (req: Request, res: Response) => {
    logger.info(`카드 삭제 ${JSON.stringify(req.query)}`)
    await Todo.findByIdAndDelete(
        {_id: req.query.id}
    ).exec()
    .then((data) => {
        res.status(200).end()})
    .catch(err => {
        res.status(500).end()
        logger.error(err)
    })
})
})

export default router