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

//   const t1 = ['20','21','42','59','74','81','101','101','164','175','177','34','526','527','58','990','991','992','160'];

//   const t2 = ['907','219','219','907','907','907','570','569','907','907','907','907','999','999','907','903','998','219','907'];


// @route    GET api/auth
// @desc     Test route
// @access   Public 
router.get('/',  (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    const pool = new Pool({
      connectionString: connectionString,
    });
     pool.query("SELECT exm_cd,exm_prd,count(*) FROM webonline.et_ol_exm_app_upload where exm_cd IN ('20','21','42','59','74','81','101','101','164','175','177','34','526','527','58','990','991','992','160') and exm_prd IN ('907','219','219','907','907','907','570','569','907','907','907','907','999','999','907','903','998','219','907') and DATE(trn_date) between '2019-10-01' and '2019-10-06' group by exm_cd,exm_prd", (err, ress) => {
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
            }).save();
      });
     // res.json("Record inserted sucessfully");
      //pool.end();
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// router.put('/', async (req, res) => {
//   try {
//    await table_dtl.map(tbl => {
//       db.one('SELECT count(*) FROM webonline.'+tbl.dt_name)
//       .then( async function (data) {
//         console.log(parseInt(data.count));
//         const tableDetails = await Table.update({ module_name : tbl.t_name},{

//           $set : {
//             "genre": {
//               _id: "5d47ce8cd36d2b2ce0d8ec69",
//               name: "Registration Cron"
//             }
//           }
//         });
//         res.json(tableDetails);
//         //tbl_details.upload_count = data;
//       })
//       .catch(function (error) {
//         console.log('ERROR:', error)
//       })

     
//     });
//     // const tableDetails = await Table.find();
//     // res.json(tableDetails);
    
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

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
