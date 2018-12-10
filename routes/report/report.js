var express = require('express');
var router = express.Router();
const moment = require('moment');

const db = require('../../module/pool.js');

router.post('/',async function(req, res){
    let usr_id = req.body.usr_id;
    let title=req.body.title;
    let purpose=req.body.purpose;
    let method=req.body.method;

    let reaction=JSON.parse(req.body.reaction);
    let subreaction=JSON.parse(req.body.subreaction);
    let product=JSON.parse(req.body.product);
    let detail=JSON.parse(req.body.rea_detail);

    if(!usr_id  || !title  || !purpose || !method ){ //값이 없을 때
        res.status(403).send({
            message : "Null Value"
        }); 
        return;
    }
    //교수 확인하기 
    let proQuery = 'SELECT pro_id FROM sys.group WHERE stu_id=?';
    let proResult = await db.queryParam_Arr(proQuery, [usr_id]); 
    if(!proResult){
        res.status(500).send({
            mesasge : "Internal Server Error"
        });
        return;
    }
    //레포트 등록하기
    let insertBoardQuery = 'INSERT INTO report (report_usr, report_pro, report_title, report_pur, report_method,report_date ) VALUES(?,?,?,?,?,?)'; 
    let insertBoardRes = await db.queryParam_Arr(insertBoardQuery, [ usr_id,proResult[0].pro_id ,title, purpose, method, moment().format("YYYY-MM-DD hh:mm:ss") ]);
    if(!insertBoardRes){
        res.status(500).send({
            mesasge : "Internal Server Error"
        });
        return;
    }
    let getAI=insertBoardRes.insertId;
    let insertreactionQuery;
    let insertreactionRes;
    //반응물
    for(var i=0;i<reaction.length;i++){
        insertreactionQuery= 'INSERT INTO reaction (report_idx, reaction_name) VALUES(?,?)'; 
        console.log(reaction[i])
        insertreactionRes = await db.queryParam_Arr(insertreactionQuery, [getAI, reaction[i]]);
        if(!insertreactionRes){
            res.status(500).send({
                mesasge : "Internal Server Error"
            });
            return;
        }
    }
    //부반응물
    for(var i=0;i<product.length;i++){
        insertreactionQuery= 'INSERT INTO sub_reaction (report_idx, sub_reaction_name) VALUES(?,?)'; 
        console.log(product[i])
        insertreactionRes = await db.queryParam_Arr(insertreactionQuery, [getAI, product[i]]);
        if(!insertreactionRes){
            res.status(500).send({
                mesasge : "Internal Server Error"
            });
            return;
        }
    }
    //생성물
    for(var i=0;i<subreaction.length;i++){
        insertreactionQuery= 'INSERT INTO product (report_idx, product_name) VALUES(?,?)'; 
        console.log(subreaction[i])
        insertreactionRes = await db.queryParam_Arr(insertreactionQuery, [getAI, subreaction[i]]);
        if(!insertreactionRes){
            res.status(500).send({
                mesasge : "Internal Server Error"
            });
            return;
        }
    }
    //detail
    for(var i=0;i<detail.length;i++){
        insertreactionQuery= 'INSERT INTO re_ma (report_idx, mat_name,mat_amount,mat_mol,mat_per,mat_note) VALUES(?,?,?,?,?,?)'; 
        console.log(detail[i])
        insertreactionRes = await db.queryParam_Arr(insertreactionQuery, [getAI, detail[i],detail[++i],detail[++i],detail[++i],detail[++i]]);
        if(!insertreactionRes){
            res.status(500).send({
                mesasge : "Internal Server Error"
            });
            return;
        }
    }
    res.status(201).send({
        message : "Success"
    }); 
    
});
router.get('/:report_idx',async function(req, res){
    
    let report_idx=req.params.report_idx;

    if(!report_idx){ //값이 없을 때
        res.status(403).send({
            message : "Null Value"
        }); 
        return;
    }
    //레포트 정보 가져오기
    let reportQuery = 'SELECT report_idx, report_title, report_pur, report_method, date_format(report_date, "%Y.%c.%e") as report_date, s.* FROM sys.report , sys.student s WHERE report_usr=stu_id AND report_idx=?';
    let reportResult = await db.queryParam_Arr(reportQuery, [report_idx]); 
    if(!reportResult){
        res.status(500).send({
            mesasge : "Internal Server Error"
        });
        return;
    }
    //반응물 정보 가져오기
    reportQuery = 'SELECT reaction_name FROM sys.reaction WHERE report_idx=?';
    let reaction = await db.queryParam_Arr(reportQuery, [report_idx]); 
    if(!reaction){
        res.status(500).send({
            mesasge : "Internal Server Error"
        });
        return;
    }
    //부 반응물 정보 가져오기
    reportQuery = 'SELECT sub_reaction_name FROM sys.sub_reaction WHERE report_idx=?';
    let sub_reaction = await db.queryParam_Arr(reportQuery, [report_idx]); 
    if(!sub_reaction){
        res.status(500).send({
            mesasge : "Internal Server Error"
        });
        return;
    }
    //생성물 정보 가져오기
    
    reportQuery = 'SELECT product_name FROM sys.product WHERE report_idx=?';
    let product = await db.queryParam_Arr(reportQuery, [report_idx]); 
    if(!product){
        res.status(500).send({
            mesasge : "Internal Server Error"
        });
        return;
    }
    reportQuery = 'SELECT * FROM sys.re_ma WHERE report_idx=?';
    let material_detail = await db.queryParam_Arr(reportQuery, [report_idx]); 
    if(!material_detail){
        res.status(500).send({
            mesasge : "Internal Server Error"
        });
        return;
    }
    res.status(201).send({
        message : "Success",
        report:reportResult[0],
        reaction,
        sub_reaction,
        product,
        material_detail
    }); 
    
});
module.exports = router;