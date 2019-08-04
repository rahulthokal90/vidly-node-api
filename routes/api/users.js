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
    check('dob', 'Date of Birth is required')
      .not()
      .isEmpty(),
    check('address', 'Address is required')
      .not()
      .isEmpty(),
    check('city', 'City is required')
      .not()
      .isEmpty(),
    check('state', 'State is required')
      .not()
      .isEmpty(),
    check('mobile', 'Mobile Number is required')
      .not()
      .isEmpty(),
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

      await user.save();
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
router.delete('/:id', async (req, res) => {
  console.log("delete" +req.params.id);
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }


    await user.remove();

    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});


// @route    PUT api/users/id
// @desc     Add users experience
// @access   Private
router.put('/:id',
[
  check('name', 'Name is required')
    .not()
    .isEmpty(),
  check('dob', 'Date of Birth is required')
    .not()
    .isEmpty(),
  check('address', 'Address is required')
    .not()
    .isEmpty(),
  check('city', 'City is required')
    .not()
    .isEmpty(),
  check('state', 'State is required')
    .not()
    .isEmpty(),
  check('mobile', 'Mobile Number is required')
    .not()
    .isEmpty(),
  check('email', 'Please include a valid email').isEmail()
],async (req, res) => {
  console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findByIdAndUpdate(
          req.params.id,
          {
            name: req.body.name,
            dob: req.body.dob,
            city: req.body.city,
            state: req.body.state,
            email: req.body.email,
            mobile: req.body.mobile,
            address: req.body.address
          },
          { new: true }
        );
      if (!user)
      return res.status(404).send("The user with the given ID was not found.");
    
        res.send(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
