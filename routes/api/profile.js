const express = require('express');
const Router = express.Router();
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
//Private Page
Router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      res.status(400).json({ msg: 'There is No profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(400).send('Server error');
  }
});
//Create or Update a user profile
Router.post('/',[auth,[
  check('status','Status is required').not().isEmpty(),
  check('skills','Skills are required').not().isEmpty()
]],async (req,res)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }
  const {company,website,location,bio,status,githubusername,skills,youtube,
  facebook,twitter,instagram,linkdin}=req.body
  //Build Profile object
  const profileFields={};
  profileFields.user=req.user.id;
  if(company) profileFields.company=company;
  if(website) profileFields.website=website;
  if(location) profileFields.location=location;
  if(bio) profileFields.bio=bio;
  if(status) profileFields.status=status;
  if(githubusername) profileFields.githubusername=githubusername;
  if(skills)profileFields.skills=skills.split(',').map(skills=>skills.trim())
  profileFields.social={}
  if(youtube) profileFields.social.youtube=youtube;
  if(twitter) profileFields.social.twitter=twitter;
  if(facebook) profileFields.social.facebook=facebook;
  if(linkdin) profileFields.social.linkdin=linkdin;
  if(instagram) profileFields.social.instagram=instagram;

  try{
    let profile=await Profile.findOne({user:req.user.id});
    if(profile){
      profile=await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},
        {new:true});
        return res.json(profile)
    }
    profile=new Profile(profileFields);
    await profile.save();
    res.json(profile)
  }catch(err){
    console.error(err.message)
  }
}
);
//Get All profiles
Router.get('/',async (req,res)=>{
  try {
    const profile=await Profile.find().populate('user',['name','avatar']);
    res.json(profile)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})
//Get User Profile
Router.get('/user/:user_id',async(req,res)=>{
  try {
    const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
    if(!profile){
     return res.status(400).json({msg:"No proile for this user"})
    }
    res.json(profile)
  } catch (error) {
    console.error(error.message)
    if(error.kind=='ObjectId'){
      return res.status(400).json({msg:'No proile for this user'})
    }
    res.status(500).send('Server Error')
  }
});

//Delete Profile,User and Posts
Router.delete('/',auth,async(req,res)=>{
  try {
    //Remove Profile
    await Profile.findOneAndRemove({user:req.user.id});
    //Remove User
    await User.findOneAndRemove({_id:req.user.id})
    //Remove Post
    return res.json({msg:'User deleted'})
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})
module.exports = Router;
