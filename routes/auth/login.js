var express = require('express');
var router = express.Router();
const moment = require('moment');

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

router.post('/', async(req, res, next) => {
  
  let id = req.body.id;
  let pw = req.body.pw;

  if(!id || !pw){
    res.status(401).send({
        message : "null value"
    });

    return;
  }
  
    let checkidQuery =
    `
    SELECT * FROM professor
    WHERE pro_id = ? and pro_pw=?
    `;

    let checkstuidQuery =
    `
    SELECT * FROM sys.student
    WHERE stu_id = ? and stu_pw=?
    `;
    try{
      let checkid = await db.queryParam_Arr(checkidQuery,[id,pw]);
  
      if(checkid.length==0){ //교수가 아닐 때
        let checkid1 = await db.queryParam_Arr(checkstuidQuery,[id,pw]);
        
        if(!checkid1){
          res.status(402).send({
            message : "no user"
          });
          return;
        }else{ //학생 유저가 있을때
          let data_res1 = {
            id : checkid1[0].stu_id,
            name : checkid1[0].stu_name,
            subject: checkid1[0].stu_subject
          }
          res.status(201).send({
            message : "success",
            data : data_res1
          });
          return;
        }
      }else{ // 교수진 일때
        let data_res = {
          id : checkid[0].pro_id,
          name : checkid[0].pro_name,
          subject: checkid[0].pro_subject
        }
        res.status(201).send({
          message : "success",
          data : data_res
        });
      }
    }catch(err){
      res.status(500).send({
        message : "Internal Server Error"
      });
      return;
    }
  });

  router.get('/:usr_id', async function(req, res){ //유저 정보 보기
    let usr_idx = req.params.usr_id; 
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
        res.status(201).send({
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