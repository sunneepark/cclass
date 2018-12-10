var express = require('express');
var router = express.Router();
const moment = require('moment');

const db = require('../../module/pool.js');


router.get('/:check/:usr_id', async function(req, res){
        let pro_id=req.params.usr_id;
        let check=parseInt(req.params.check);
        if(!pro_id){ //값이 없을 때
            res.status(403).send({
                message : "Null Value"
            }); 
            return;
        }
        if(!check){ //학생 확인하기
            //담당교수 학인하기
            let proQuery = 'SELECT pro_id FROM sys.group WHERE stu_id=?';
            let proResult = await db.queryParam_Arr(proQuery, [pro_id]); 
            if(!proResult){
                res.status(500).send({
                    mesasge : "Internal Server Error"
                });
                return;
            }
            pro_id=proResult[0].pro_id;
        }

        //레포트 정보 가져오기
        let reportQuery = 'SELECT * FROM sys.form WHERE pro_id=?';
        let reportResult = await db.queryParam_Arr(reportQuery, [pro_id]); 
        if(!reportResult){
            res.status(500).send({
                mesasge : "Internal Server Error"
            });
            return;
        }
        else if(reportResult.length==0){
            res.status(201).send({
                mesasge : "교수 정보가 없습니다"
            });
            return;
        }

        res.status(201).send({
            message : "Success", 
            result : reportResult[0]
        });
    });

    router.post('/', async function(req, res){
        let pro_id = req.body.pro_id;
        let title=req.body.title;
        let purpose=req.body.purpose;
        let schema=req.body.schema;
        if(!pro_id  || !title  || !purpose || !schema ){ //값이 없을 때
            res.status(403).send({
                message : "Null Value"
            }); 
            return;
        }
       //레포트 양식  등록하기
        let insertBoardQuery = 'UPDATE sys.form SET title=? , purpose=? , content=? WHERE pro_id = ?'; 
        let insertBoardRes = await db.queryParam_Arr(insertBoardQuery, [ title, purpose, schema,pro_id]);
        if(!insertBoardRes){
            res.status(500).send({
                mesasge : "Internal Server Error"
            });
            return;
        }
        
        res.status(201).send({
            message : "Success"
        });
    });
    module.exports = router;