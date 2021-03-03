const router    =   require('express').Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin',(req, res)=>{
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/users/signin',
    failureFlash:   true
}));

router.get('/users/signup',(req, res)=>{
    res.render('users/signup');
});

router.post('/users/signup',async (req,res)=>{
const{name,email,password,confirm_password}=req.body;
const errors = [];
if (name.length<=0){
    errors.push({text: 'debe ingresar un nombre'});
}
if (password!=confirm_password){
    errors.push({text: 'Las contraceñas no coinciden'});
}
if (password.length<4){
    errors.push({text: 'La contraceña debe ser almenos de cuatro caracteres'});
}
if (errors.length>0){
    res.render('users/signup',{errors, name, email, password, confirm_password});
}
else{
    console.log('ok');
    const emailUser = await User.findOne({email: email})
    if(emailUser){
        req.flash('success_msg','El email ya se encuentra registrado');
        res.redirect('/users/signup');
     }
    else{
    const newUser   =   new User({name,email,password});
    newUser.password =  await newUser.encryptPassword(password);
    await newUser.save();
    req.flash('success_msg','El usuario ha sido creado satisfactoriamete');
    res.redirect('/users/signin');}
    
}

});
router.get('/users/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
});

module.exports  =   router;