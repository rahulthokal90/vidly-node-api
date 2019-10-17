const express = require('express');
const { Pool } = require('pg');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const {Exam} = require('../../models/Exam');
//const pgp = require('pg-promise')(/* options */)
// const db = pgp('postgres://webonline_user:webonline_esds@10.10.233.68:5432/memdba');

const connectionString = 'postgres://webonline_user:webonline_esds@10.10.233.68:5432/memdba';

// const table_dtl = [
//   {id : 1, t_name : 'exam_app', dt_name : 'et_ol_exm_invoice_upload_hist'}

//   ];

   const t1 = ['20','21','42','59','60','62','63','64','65','66','67','68','69','70','71','72','74','81','101','164','175','177','200','340','580','526'];

  const t2 = ['907','219','571','908','999'];
  const pool = new Pool({
    connectionString: connectionString,
  });

// @route    GET api/auth
// @desc     Test route
// @access   Public 
router.get('/exam', async (req, res) => {
  try {
     const tableDetails = await Exam.find();
     res.json(tableDetails);
      res.json(table_dtl);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route    GET api/auth
// @desc     Test route
// @access   Public 
router.post('/',  (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    let str = `SELECT exm_cd,exm_prd,count(*) FROM webonline.et_ol_exm_app_upload where exm_cd IN (${t1}) and exm_prd IN (${t2}) and DATE(trn_date) between '2019-10-01' and '2019-10-06' group by exm_cd,exm_prd`;
   
     pool.query(str, (err, ress) => {
      //ress.rows.find().map( function(u) { return u.exm_cd; } );
      ress.rows.forEach(function (row) {
        console.log(row);
         new Exam({
              'exm_cd' : row.exm_cd,
              'exm_prd' : row.exm_prd,
              'total_exam_reg' : 0,
              'total_invc' : 0,
              'exm_app_upd': row.count,
              'exm_app_hist' : 0,
              'exm_invc_upd' : 0,
              'exm_invc_hist' : 0,
              'from_date' : '2019-10-01',
              'to_date' : '2019-10-06', 
            }).save();
      });
      res.json("Record inserted sucessfully");
      
    });
    pool.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.put('/update', async (req, res) => {
  try {
    
    const tableDetails = await Exam.find().select('exm_cd exm_prd');
    //console.log(tableDetails);
    const arrExam = [
     // {tbl_name : 'et_ol_exm_app_upload_hist', date_type :'trn_date'},
      // {tbl_name : 'et_ol_exm_invoice_upload', date_type :'date_of_invoice'},
       {tbl_name : req.body.tblName, date_type :req.body.dateType}
    ];
    // const arrData = [];
    // arrExam.map(exm => {
    //   tableDetails.map(tt1 => {
    //    arrData.push(`SELECT exm_cd,exm_prd,count(*) FROM webonline.${exm.tbl_name} where exm_cd = '${tt1.exm_cd}' and exm_prd = '${tt1.exm_prd}' and DATE(${exm.date_type}) between '2019-10-01' and '2019-10-06' group by exm_cd,exm_prd`);
    //   });
    // });
    // arrData.forEach(myFunction);
    // function myFunction(item, index) {
    //   console.log(item);
    //    pool.query(item, (err1, res_sub) => {
    //     console.log(res_sub.rows);
    //     console.log(index);
    //         if(res_sub.rows){
    //         res_sub.rows.forEach(async function (row1) {
    //           console.log(row1.count);
    //           console.log(exm.tbl_name);
    //             Exam.findByIdAndUpdate(
    //             tt1._id,
    //             {
    //               exm_app_hist: (row1.count)? row1.count :0
    //             },
    //             { new: true }
    //           );
    //       });
    //     }
    //   });
    //   //pool.end();
    //  // console.log(item + '--' + index)
    // }
    // arrData.map(function(exm) {
    //   console.log(exm);
    //    pool.query(exm, (err1, res_sub) => {
    //     console.log(res_sub.rows);
    //   });
    // });
    //console.log(arrData);
    arrExam.map(exm => {
      tableDetails.map(tt1 => {
          let str1 = `SELECT count(*) FROM webonline.${exm.tbl_name} where exm_cd = '${tt1.exm_cd}' and exm_prd = '${tt1.exm_prd}' and DATE(${exm.date_type}) between '${req.body.fromDate}' and '${req.body.toDate}' group by exm_cd,exm_prd`;
          //console.log(tt1);
          pool.query(str1, (err1, res_sub) => {
            //if(err1) return "data already present";
          
           //res.send(res_sub);
           if(res_sub.rows){  
            
                res_sub.rows.forEach( async function (row1) {
                  
                  if(exm.tbl_name == 'et_ol_exm_invoice_upload_hist'){
                    console.log(row1)
                    await Exam.updateMany({ _id : tt1._id},{
                      $set : {
                          "exm_invc_hist": row1.count,
                          "from_date": req.body.fromDate,
                          "to_date": req.body.toDate
                      }
                    });
                  }else if(exm.tbl_name == 'et_ol_exm_invoice_upload'){
                    await Exam.updateMany({ _id : tt1._id},{
                      $set : {
                          "exm_invc_upd": row1.count,
                          "from_date": req.body.fromDate,
                          "to_date": req.body.toDate
                      }
                    });
                  }else{
                    await Exam.updateMany({ _id : tt1._id},{
                      $set : {
                          "exm_app_hist": row1.count,
                          "from_date": req.body.fromDate,
                          "to_date": req.body.toDate
                      }
                    });
                  }
              });
           }
        });
      });
      pool.end();
    });
    

    //ress.rows.forEach(function (row) {
      // const str1 = `SELECT exm_cd,exm_prd,count(*) FROM webonline.et_ol_exm_app_upload_hist where exm_cd = '${row.exm_cd}' and exm_prd = '${row.exm_prd}' and DATE(trn_date) between '2019-10-01' and '2019-10-06' group by exm_cd,exm_prd`;
      // pool.query(str, (err1, res_sub) => {
      //   res_sub.rows.forEach(function (row1) {
      //     new Exam({
      //       'exm_cd' : row.exm_cd,
      //       'exm_prd' : row.exm_prd,
      //       'total_exam_reg' : 0,
      //       'total_invc' : 0,
      //       'exm_app_upd': row.count,
      //       'exm_app_hist' : row1.count,
      //       'exm_invc_upd' : 0,
      //       'exm_invc_hist' : 0, 
      //     }).save();
      //   });
      // });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// // @route    POST api/users
// // @desc     Register user
// // @access   Public
// router.post(
//   '/',
//   [
//     check('module_name', 'Module Name is required')
//       .not()
//       .isEmpty(),
//     check('module_desc', 'Module Description is required')
//       .not()
//       .isEmpty(),
//     check('upload_count', 'Upload Count is required')
//       .not()
//       .isEmpty(),
//     check('hist_count', 'Hist Count is required')
//       .not()
//       .isEmpty()
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { module_name, module_desc, upload_count, hist_count } = req.body;

//     try {
//       // let tbl_info = await User.find();

//       // if (tbl_info) {
//       //   return res
//       //     .status(400)
//       //     .json({ errors: [{ msg: 'User already exists' }] });
//       // }

//       tbl = new Table({
//         module_name,
//         module_desc,
//         upload_count,
//         hist_count
//       });

//       await tbl.save();
//       res.json("Record inserted sucessfully");
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// );


module.exports = router;
