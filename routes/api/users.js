
const auth = require("../../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../../models/user");
const express = require("express");
const router = express.Router();


// @route    GET api/auth
// @desc     Test route
// @access   Public 
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

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
