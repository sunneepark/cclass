var express = require('express');
var router = express.Router();
const moment = require('moment');

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

router.get('/:usr_id', async function(req, res){ //유저 정보 보기
    let usr_idx = req.params.usr_id; 
    if(!usr_idx){
        res.status(401).send({
            message : "null value"
        });
    
        return;
    }
    let sortAlarmQuery =`SELECT pro_name, report_check FROM sys.report, sys.professor where report_pro=pro_id and report_usr=? and report_check !=0 order by report_checkdate, report_feeddate desc;`;
    try{
      let checkalarm = await db.queryParam_Arr(sortAlarmQuery,[usr_idx]);
      if(!checkalarm){
        res.status(500).send({
            message : "Internal Server Error"
        });
        return;
      }
      else if(checkalarm.length>0){
        let data_res=[];
        for(var i=0;i<checkalarm.length;i++){
          if(checkalarm[i].report_check ==1)
            data_res.push(checkalarm[i].pro_name+" 교수님이 확인하셨습니다.");
          else if (checkalarm[i].report_check ==2)
            data_res.push(checkalarm[i].pro_name+" 교수님이 피드백을 남기셨습니다.");
        }
        res.status(201).send({
          message : "success",
          data:data_res
        });
        return;
      }
      else{
        res.status(202).send({
          message : "there is no alarm"
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