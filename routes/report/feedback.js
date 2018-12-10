var express = require('express');
var router = express.Router();
const moment = require('moment');

const db = require('../../module/pool.js');

router.post('/', async function(req, res){

    let report_idx=req.body.report_idx;
    let feedback=req.body.feedback;

    if(!report_idx || !feedback){
        res.status(400).send({
            message : "Null Value"
        }); 
        return;
    }
    //피드백 등록하기
    let insertBoardQuery = 'UPDATE report SET report_feedback =? , report_feeddate =? WHERE report_idx = ?';
    let insertBoardRes = await db.queryParam_Arr(insertBoardQuery, [ feedback, moment().format("YYYY-MM-DD hh:mm:ss"), report_idx ]);
    if(!insertBoardRes){
        res.status(500).send({
            mesasge : "Internal Server Error"
        });
        return;
    }
    res.status(200).send({
        message : "Success"
    });
});
router.get('/:report_idx', async function(req, res){
    let report_idx=req.params.report_idx;
    if(!report_idx){ //값이 없을 때
        res.status(403).send({
            message : "Null Value"
        }); 
        return;
    }
    //피드백 정보 가져오기
    let reportQuery = 'SELECT report_feedback FROM sys.report WHERE report_idx=?';
    let reportResult = await db.queryParam_Arr(reportQuery, [report_idx]); 
    if(!reportResult){
        res.status(500).send({
            mesasge : "Internal Server Error"
        });
        return;
    }

    res.status(201).send({
        message : "Success", 
        result : reportResult[0]
    });
});

module.exports = router;