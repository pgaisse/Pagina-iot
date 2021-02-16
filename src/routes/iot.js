const router    =   require('express').Router();
const Sensor    =   require('../models/Iot');
const Meas    =   require('../models/Meas');
const { v4: uuidv4 } = require('uuid');
const {isAuthenticated} = require('../helpers/auth');
var params={}, paramsall={}, limit=10 ;
const mqtt     =   require('mqtt');
const top={};



router.get('/iot/add', isAuthenticated, async (req, res)=>{
    const topicos = await Sensor.distinct("topic");
    res.render('iot/new-reg',{topicos: topicos});
});

router.get('/iot/all-messages',isAuthenticated, async (req, res)=>{
    limit= req.query.limit || 10;
    const user= req.user.id;
    const topicos = await Sensor.distinct("topic", {"user":user});
    const sensors= await Meas.paginate(paramsall,{lean:true, limit:limit,sort:{$natural:-1}}) 
    res.render('iot/all-messages', { sensors: sensors, topicos:topicos})
});


router.post('/iot/all-messages', isAuthenticated, async (req, res)=>{
    var {topic,vmin,vmax, date1, date2}=req.body;
    const errors=[]; 
    
    if (!topic){
        errors.push({text: 'Por favor ingrese un tópico'});
    }   
    if (!vmin){
        vmin=-99999999;
    }   
    if (!vmax){
        vmax=999999999;
    }

    if (!date1){
        errors.push({text: 'Por favor ingrese la fecha de inicio'});
    }  
    if (!date2){
        errors.push({text: 'Por favor ingrese la fecha de término'});
    }  
    const topicos = await Sensor.distinct("topic");
    if(errors.length > 0){
        res.render('iot/all-messages',{
            errors,
            topic,
            topicos
        });

    }
    else{
        var dateiso1=new Date(date1);
        var dateiso2=new Date(date2);
        const user= req.user.id;
        params={topic:topic};
        paramsall={value:{$gte: vmin, $lte: vmax} ,topic:topic ,date:{ $gte:dateiso1,$lte:dateiso2}};
        const sensors= await Meas.paginate(paramsall,{lean:true, limit:limit,sort:{$natural:-1}}) 
        res.render('iot/all-messages', { sensors: sensors, topicos:topicos})
    }



});


router.get('/iot', isAuthenticated, async (req, res)=>{
    const user= req.user.id;
    const sensors= await Meas.paginate(paramsall,{lean:true, limit:limit,sort:{$natural:-1}}) 
    const topicos = await Sensor.distinct("topic", {"user":user});
    res.render('iot/all-messages',{sensors:sensors,topicos: topicos});
});

router.post('/iot/new-reg', isAuthenticated, async (req,res)=>{
    const {topic,value}=req.body;
    const errors=[];
 
    if(!topic){
        errors.push({text: 'por favor revise el tópico'});
    }

    if(!value){
        errors.push({text: 'por favor revise el valor'});
    }

    if(errors.length > 0){
        res.render('iot/new-reg',{
            errors,
            topic,
            value
    });

    }
    else{
        
        async function mqtt_p(){
            var broker='mqtt://190.114.254.218';

            var client = mqtt.connect(broker, {
                username: 'telemetria',
                password: 'telemetria.2021' 
            });

                await client.on('connect', async () =>{
                await client.publish(topic, value)
            })
        }
        mqtt_p();
        const topicos = await Sensor.distinct("topic");        
        const newSensor   =   new Sensor({topic,value});
        //newNote.user = req.user.id;
        await newSensor.save();
        req.flash('success_msg', 'Mensaje enviado satisfactoriamente');
        res.render('iot/new-reg',{topicos: topicos});
    }
});



router.get('/iot/chart', async (req, res)=>{


})
router.get('iot/devices', async (req, res)=>{

    res.render('index.html');
})

router.get('/iot/new-reg', isAuthenticated,async (req, res)=>{
    const topicos = await Sensor.distinct("topic");
    res.render('iot/new-reg',{topicos: topicos});
})

router.get('/iot/sensors', isAuthenticated, async (req, res)=>{
    const sensors = await Sensor.find({}).lean()
    sensors.user=req.user.id;
    res.render('iot/sensors', sensors);
})



router.post('/iot/new-sensor', isAuthenticated, async (req, res)=>{
    const {name, type, description}= req.body;
    const errors=[];
 
    if(!name){
        errors.push({text: 'por favor revise el nombre'});
    }

    if(!type){
        errors.push({text: 'por favor revise el tipo de sensor'});
    }

    if(!description){
        errors.push({text: 'por favor revise la descripción'});
    }


    if(errors.length > 0){
        res.render('iot/new-sensor',{
            errors,
            name,
            type,
            description
        });

    }
    else{
        topic=req.user.id+"/"+type+"/"+uuidv4();
        const user=req.user.id;
        const newSensor   =   new Sensor({user,topic,type,name, description});
        newSensor.save();
        req.flash('success_msg', 'Sensor registrado correctamente');
        console.log(user,"Se ha guardado un nuevo sensor con exito")
        res.render('iot/new-sensor');
    
    }



  
})





router.get('/iot/new-sensor', isAuthenticated, async (req, res)=>{
    res.render('iot/new-sensor');
    //console.log(uuidv4());
})

router.get('/iot/all-ajax',isAuthenticated,async (req, res)=>{
    const user= req.user.id;

    const topicos = await Sensor.distinct("topic", {"user":user});
    //console.log(top)
    const sensors = await Meas.find(params).sort({$natural:-1}).limit(1);

    res.json({sensors,topicos});
})


router.get('/iot/panel', isAuthenticated, async (req, res)=>{
    const user=req.user.id;
    const name=req.user.name;
    const query = await Sensor.distinct("topic");
    //console.log("consulta",query);
    const sensors = await Sensor.find({user:user, topic:query}).limit(query.length).lean();
    res.render('iot/panel',{sensors,name});
})
module.exports  =   router;

