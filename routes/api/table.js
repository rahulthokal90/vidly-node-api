const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const Table = require('../../models/Table');
const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://webonline_user:webonline_esds@10.10.233.68:5432/memdba');

const table_dtl = [
  {id : 1, t_name : 'exam_app', dt_name : 'et_ol_exm_invoice_upload_hist'},
  {id : 2, t_name : 'mem_reg', dt_name : 'mt_ol_mem_upload'},
  {id : 3, t_name : 'mem_edit', dt_name : 'mt_ol_mem_profile_cng_upload'},
  {id : 4, t_name : 'dup_icard', dt_name : 'mt_ol_mem_upld_dup_icard'},
  {id : 5, t_name : 'dra_mem', dt_name : 'mt_ol_mem_upload'},
  {id : 6, t_name : 'dra_exam', dt_name : 'et_ol_exm_app_upload'},
  {id : 7, t_name : 'dup_cert', dt_name : 'et_ol_exm_dup_cert_upld'},
  {id : 8, t_name : 'mem_renewal', dt_name : 'mt_ol_mem_renewal_upload'},
  {id : 9, t_name : 'admit_card', dt_name : 'et_ol_exm_admit_card_upload'},
  {id : 10, t_name : 'bnkqst', dt_name : 'mt_ol_bank_quest_upload'},
  ];


// @route    GET api/auth
// @desc     Test route
// @access   Public 
router.get('/', async (req, res) => {
  try {
    const tableDetails = await Table.find();
    res.json(tableDetails);
    //res.json(table_dtl);
  //  await table_dtl.map(tbl => {
  //     db.one('SELECT count(*) FROM webonline.'+tbl.dt_name)
  //     .then( async function (data) {
  //       console.log(parseInt(data.count));
  //       const tableDetails = await Table.update({ module_name : tbl.t_name},{

  //         $set : {
  //           upload_count : parseInt(data.count)
  //         }
  //       });
  //       res.json(tableDetails);
  //       //tbl_details.upload_count = data;
  //     })
  //     .catch(function (error) {
  //       console.log('ERROR:', error)
  //     })

     
  //   });
    // const tableDetails = await Table.find();
    // res.json(tableDetails);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  [
    check('module_name', 'Module Name is required')
      .not()
      .isEmpty(),
    check('module_desc', 'Module Description is required')
      .not()
      .isEmpty(),
    check('upload_count', 'Upload Count is required')
      .not()
      .isEmpty(),
    check('hist_count', 'Hist Count is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { module_name, module_desc, upload_count, hist_count } = req.body;

    try {
      // let tbl_info = await User.find();

      // if (tbl_info) {
      //   return res
      //     .status(400)
      //     .json({ errors: [{ msg: 'User already exists' }] });
      // }

      tbl = new Table({
        module_name,
        module_desc,
        upload_count,
        hist_count
      });

      await tbl.save();
      res.json("Record inserted sucessfully");
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);
// @route    DELETE api/users/:id
// @desc     Delete a user
// @access   Private
// router.delete('/:id', async (req, res) => {
//   console.log("delete" +req.params.id);
//   try {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' });
//     }


//     await user.remove();

//     res.json({ msg: 'User removed' });
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'User not found' });
//     }
//     res.status(500).send('Server Error');
//   }
// });


// @route    PUT api/users/id
// @desc     Add users experience
// @access   Private
// router.put('/:id',
// [
//   check('name', 'Name is required')
//     .not()
//     .isEmpty(),
//   check('dob', 'Date of Birth is required')
//     .not()
//     .isEmpty(),
//   check('address', 'Address is required')
//     .not()
//     .isEmpty(),
//   check('city', 'City is required')
//     .not()
//     .isEmpty(),
//   check('state', 'State is required')
//     .not()
//     .isEmpty(),
//   check('mobile', 'Mobile Number is required')
//     .not()
//     .isEmpty(),
//   check('email', 'Please include a valid email').isEmail()
// ],async (req, res) => {
//   console.log(req.body);
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     try {
//         const user = await User.findByIdAndUpdate(
//           req.params.id,
//           {
//             name: req.body.name,
//             dob: req.body.dob,
//             city: req.body.city,
//             state: req.body.state,
//             email: req.body.email,
//             mobile: req.body.mobile,
//             address: req.body.address
//           },
//           { new: true }
//         );
//       if (!user)
//       return res.status(404).send("The user with the given ID was not found.");
    
//         res.send(user);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }
//   }
// );

module.exports = router;
