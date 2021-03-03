const router    =   require('express').Router();

router.get('/', (req, res)=>{
    res.render('index');
});

router.get('/plantilla',(req, res)=>{
    res.render('index2');
});

router.get('/about', (req, res)=>{
    res.render('about');
});

module.exports  =   router;
