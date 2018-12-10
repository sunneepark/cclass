var express = require('express');
var router = express.Router();
const moment = require('moment');

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

router.get('/:pro_id', async function(req, res){ //유저 정보 보기
    let usr_idx = req.params.pro_id; 
    if(!usr_idx){
        res.status(401).send({
            message : "null value"
        });
    
        return;
    }
    let sortAlarmQuery =`SELECT s.*, date_format(r.report_date, "%Y.%c.%e") as date, r.report_title, r.report_idx FROM sys.student s, sys.report r where r.report_check=0 and r.report_usr=s.stu_id and s.stu_id in (select g.stu_id from sys.group g where g.pro_id=?);`;
    try{
      let checkalarm = await db.queryParam_Arr(sortAlarmQuery,[usr_idx]);
      if(!checkalarm){
        res.status(500).send({
            message : "Internal Server Error"
        });
        return;
      }
      else if(checkalarm.length>0){
        res.status(201).send({
          message : "success",
          data:checkalarm
        });
        return;
      }
    }catch(err){
      res.status(500).send({
        message : "Internal Server Error"
      });
      return;
    }
  });

module.exports = router;