import express, { Request, Response } from 'express'
const logger = require("../winston")


const router = express.Router()

// Models
import Session from '../DB/model/Session'

/*
    ===== GET =====
*/

/*
    ===== PUT =====
*/
router.put('/change/nickname', async (req: Request, res: Response) => {
    logger.info(`change nickname 쿼리 들어옴 `)
    Session.findOneAndUpdate({
        userid: req.userid
    },{
        $set:{nickname: req.body.nickname}
    })
    .then(() => res.send({nickname: req.body.nickname}))
    .catch(err => {logger.error(err)})
})


export default router