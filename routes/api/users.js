const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
console.log('users');
const User = require('../../models/User');

// @route    GET api/auth
// @desc     Test route
// @access   Public 
router.get('/', async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
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
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    // check('dob', 'Date of Birth is required')
    //   .not()
    //   .isEmpty(),
    // check('address', 'Address is required')
    //   .not()
    //   .isEmpty(),
    // check('city', 'City is required')
    //   .not()
    //   .isEmpty(),
    // check('state', 'State is required')
    //   .not()
    //   .isEmpty(),
    // check('mobile', 'Mobile Number is required')
    //   .not()
    //   .isEmpty(),
    check('email', 'Please include a valid email').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address, dob, city, state, mobile } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        dob,
        address,
        city,
        state,
        mobile,
        email
      });

      // const salt = await bcrypt.genSalt(10);

      // user.password = await bcrypt.hash(password, salt);

      await user.save();
      res.json("Record inserted sucessfully");
      // const payload = {
      //   user: {
      //     id: user.id
      //   }
      // };

      // jwt.sign(
      //   payload,
      //   config.get('jwtSecret'),
      //   { expiresIn: 360000 },
      //   (err, token) => {
      //     if (err) throw err;
      //     res.json({ token });
      //   }
      // );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
