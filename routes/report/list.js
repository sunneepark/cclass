var express = require('express');
var router = express.Router();
const moment = require('moment');

const db = require('../../module/pool.js');


router.get('/:usr_id', async function(req, res){
    
        //레포트 정보 가져오기
        let reportQuery = 'SELECT report_title, report_check, report_feedback FROM report WHERE report_usr=?';
        let reportResult = await db.queryParam_Arr(reportQuery, [req.params.usr_id]); 
        if(!reportResult){
            res.status(500).send({
                mesasge : "Internal Server Error"
            });
            return;
        }

        res.status(201).send({
            message : "Success", 
            reportResult
        });
    });

    module.exports = router;