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

  
    module.exports = router;