<<<<<<< HEAD
const express = require('express');
const Router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
//@route
Router.post(
  '/',
  [
    check('name', 'Name is Required')
      .not()
      .isEmpty(),
    check('email', 'please include a valid Email').isEmail(),
    check('password', 'Please enter a password with min length 6').isLength({
      min: 6
    })
  ],
  async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      //Get user find if it exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      //gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      user = new User({
        name,
        email,
        avatar,
        password
      });
      //Encrypt passsord
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      res.send('Users registered');
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = Router;
=======
const express=require('express');
const Router=express.Router();


//@route
Router.get('/',(req,res)=>{
    res.send('Users route');
});

module.exports=Router;
>>>>>>> 31c91d6492388fcb55b3af019b481efa4f213ca5
