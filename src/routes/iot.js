const router    =   require('express').Router();
const Sensor    =   require('../models/Iot');
const Measm    =   require('../models/Measm');
const Meas    =   require('../models/Meas');
const { v4: uuidv4 } = require('uuid');
const {isAuthenticated} = require('../helpers/auth');
const fs        =   require('fs-extra');
const mqtt     =   require('mqtt');
var params={}, paramsall={}, limit=10, paramsallgraf={}, lastparams={} ;
var currenttopic="", query="";
const top={};
//json_graph=fs.readFileSync('src/graph.json','utf-8');
var json_graph={};
//var graph=JSON.parse(json_graph);
var graph=[];


router.get('/iot/add', isAuthenticated, async (req, res)=>{
    const topicos = await Sensor.distinct("topic");
    res.render('iot/new-reg',{topicos: topicos});
});

router.get('/iot/all-messages',isAuthenticated, async (req, res)=>{
    limit= req.query.limit || 10;
    const user= req.user.id;
    const topicos = await Sensor.distinct("topic", {"user":user});
    const sensors= await Meas.paginate(paramsall,{lean:true, limit:limit,sort:{$natural:-1}}) 
    const sp= await Meas
    .find({topic:"600e45126a122a4a20fdb07c/Sensor/afcc9f72-ca97-457a-890d-363ca1b98a4a"})
    .sort({$natural:-1}).limit(1).lean(); 
    const st= await Meas
    .find({topic:"600e45126a122a4a20fdb07c/Sensor/ac184b65-fbc2-4192-864c-04111dbf5290"})
    .sort({$natural:-1}).limit(1).lean(); 
    //console.log("sensor de temperatura :",st);
    res.render('iot/all-messages', { sensors: sensors, topicos:topicos, sp:sp, st:st})
});


router.post('/iot/all-messages', isAuthenticated, async (req, res)=>{
    var {topic,vmin,vmax, date1, date2}=req.body;
    const errors=[]; 
    
   
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
        paramsall={value:{$gte: vmin, $lte: vmax} ,date:{ $gte:dateiso1,$lte:dateiso2}}
        paramsallgraf={value:{$gte: vmin, $lte: vmax} ,topic:topic ,date:{ $gte:dateiso1,$lte:dateiso2},value:1}
        const graf= await Meas.find(paramsall,{value:1, date:1, _id:0}).sort({$natural:-1}).limit(56)
        const sensors= await Meas.paginate(paramsall,{lean:true, limit:limit,sort:{$natural:-1}})
        //console.log("graf",graf)
        const lastopen= await Meas
        .find({topic:"600e45126a122a4a20fdb07c/Sensor/afcc9f72-ca97-457a-890d-363ca1b98a4a", value:"1"})
        .sort({$natural:-1}).limit(1).lean();
        const sp= await Meas
        .find({topic:"600e45126a122a4a20fdb07c/Sensor/afcc9f72-ca97-457a-890d-363ca1b98a4a"})
        .sort({$natural:-1}).limit(1).lean(); 
        const st= await Meas
        .find({topic:"600e45126a122a4a20fdb07c/Sensor/ac184b65-fbc2-4192-864c-04111dbf5290"})
        .sort({$natural:-1}).limit(1).lean(); 

        res.render('iot/all-messages', { sensors: sensors, topicos:topicos, lastopen:lastopen, st:st, sp:sp,graf:graf})
        
    }



});

router.get('/iot/prueba', isAuthenticated, async (req, res)=>{
    const user= req.user.id;
    var graf= await Meas.paginate(paramsall,{lean:true, limit:limit ,sort:{$natural:-1}})
    //graf=JSON.stringify(graf.docs)
    var topicoss= await Sensor.find({"user":user, "type":"Sensor"}).lean();
    var topicosd= await Sensor.find({"user":user, "type":"Actuador"}).lean();
    
   // console.log("sensor de temperatura :",st);
    //console.log(topicos)
    res.render('iot/prueba', { topicoss:topicoss, topicosd:topicosd,  graf:graf })

});


router.get('/iot', isAuthenticated, async (req, res)=>{
    limit= req.query.limit || 10;
    const user= req.user.id;
    const sensors= await Meas.paginate(paramsall,{lean:true, limit:limit,sort:{$natural:-1}}) 
    const topicos = await Sensor.distinct("topic", {"user":user});
    const sp= await Meas
    .find({topic:"600e45126a122a4a20fdb07c/Sensor/afcc9f72-ca97-457a-890d-363ca1b98a4a"})
    .sort({$natural:-1}).limit(1).lean(); 
    const st= await Meas
    .find({topic:"600e45126a122a4a20fdb07c/Sensor/ac184b65-fbc2-4192-864c-04111dbf5290"})
    .sort({$natural:-1}).limit(1).lean(); 
    const lastopen= await Meas
    .find({topic:"600e45126a122a4a20fdb07c/Sensor/afcc9f72-ca97-457a-890d-363ca1b98a4a", value:"1"})
    .sort({$natural:-1}).limit(1).lean();
    var graf= await Meas.paginate(paramsall,{lean:true, limit:limit ,sort:{$natural:-1}})
    graf=graf.docs
    res.render('iot/all-messages', { sensors: sensors, topicos:topicos, sp:sp, st:st,lastopen:lastopen, graf:graf})
});


router.get('/iot/g-view', isAuthenticated, async (req, res)=>{
    const user= req.user.id;
    //const sensors= await Meas.paginate(paramsall,{lean:true, limit:limit,sort:{$natural:-1}}) 
    //const topicos = await Sensor.distinct("topic", {"user":user});
    const sp= await Meas
    .find({topic:"600e45126a122a4a20fdb07c/Sensor/afcc9f72-ca97-457a-890d-363ca1b98a4a"})
    .sort({$natural:-1}).limit(1).lean(); 
    const st= await Meas
    .find({topic:"600e45126a122a4a20fdb07c/Sensor/ac184b65-fbc2-4192-864c-04111dbf5290"})
    .sort({$natural:-1}).limit(1).lean(); 
    const lastopen= await Meas
    .find({topic:"600e45126a122a4a20fdb07c/Sensor/afcc9f72-ca97-457a-890d-363ca1b98a4a", value:"1"})
    .sort({$natural:-1}).limit(1).lean();
   // console.log("sensor de temperatura :",st);
    //res.json({sp,st,lastopen});
    res.render('iot/g-view', { sp:sp, st:st,lastopen:lastopen })
});

router.get('/services', isAuthenticated, async (req, res)=>{
    res.render('services');
})

router.get('/iot/g-view-ajax', isAuthenticated, async (req, res)=>{
    const user= req.user.id;
    //const sensors= await Meas.paginate(paramsall,{lean:true, limit:limit,sort:{$natural:-1}}) 
    //const topicos = await Sensor.distinct("topic", {"user":user});
    const sp= await Meas
    .find({topic:"600e45126a122a4a20fdb07c/Sensor/afcc9f72-ca97-457a-890d-363ca1b98a4a"})
    .sort({$natural:-1}).limit(1).lean(); 
    const st= await Meas
    .find({topic:"600e45126a122a4a20fdb07c/Sensor/ac184b65-fbc2-4192-864c-04111dbf5290"})
    .sort({$natural:-1}).limit(1).lean(); 
    const lastopen= await Meas
    .find({topic:"600e45126a122a4a20fdb07c/Sensor/afcc9f72-ca97-457a-890d-363ca1b98a4a", value:"1"})
    .sort({$natural:-1}).limit(1).lean();
   // console.log("sensor de temperatura :",st);
    res.json({sp,st,lastopen});
    //res.render('iot/g-view', { sp:sp, st:st,lastopen:lastopen })
});

router.post('/iot/new-reg', isAuthenticated, async (req,res)=>{
    const {topic,value}=req.body;
    const errors=[];
    currenttopic=topic;
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
        const newSensor   =   new Meas({topic,value});
        //newNote.user = req.user.id;
        await newSensor.save();
        
        req.flash('success_msg', 'Mensaje enviado satisfactoriamente');
        res.render('iot/new-reg',{topicos: topicos});
        res.send("OK");
    }
});
router.get('/iot/sendcurrentreg', async (req, res)=>{
    const lastreg= await Meas.find({"topic":"600e45126a122a4a20fdb07c/Actuador/3f1dc98a-aa8a-4c3d-86ad-164ab998696c"}).sort({$natural:-1}).limit(1).lean();
    res.json({lastreg})
})

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


router.post('/iot/post-graph',isAuthenticated,async (req, res)=>{
    var today= new Date();
    var todayb=new Date(today.getTime());
    var todaya= new Date(today.getTime() - 1000 * 60*60 );
    console.log(todaya);

    var {topic,vmin,vmax}=req.body;
    var date1= req.body.date1 || todaya.getFullYear() + '-' + ('0' + (todaya.getMonth() + 1)).slice(-2) + '-' + ('0' + todaya.getDate()).slice(-2)+'T'+('0' + todaya.getHours()).slice(-2)+':'+('0' + todaya.getMinutes()).slice(-2)+':'+('0' + todaya.getSeconds()).slice(-2);
    var date2= req.body.date2 || todayb.getFullYear() + '-' + ('0' + (todayb.getMonth() + 1)).slice(-2) + '-' + ('0' + todayb.getDate()).slice(-2)+'T'+('0' + todayb.getHours()).slice(-2)+':'+('0' + todayb.getMinutes()).slice(-2)+':'+('0' + todayb.getSeconds()).slice(-2);
    var interval=req.body.interval || 0;
    
    var dateiso1=date1;
    var dateiso2=date2;
    if (!vmin){
        vmin=-99999999;
    }   
    if (!vmax){
        vmax=999999999;
    }
    paramsall={value:{$gte: vmin, $lte: vmax},topic:topic,interval:"m_10" ,date:{ $gte:dateiso1,$lte:dateiso2}}
    //console.log(graf)
    query='SELECT * from meas where MINUTE(date) BETWEEN 0 and 59 AND SECOND(date) BETWEEN 0 and '+interval+' AND value BETWEEN '+vmin+' AND '+vmax+' AND topic="'+topic+'" and date BETWEEN "'+dateiso1+'" and "'+dateiso2+'" ORDER by ID DESC';
    console.log(query)
    res.send("datos recibidos");

})

router.get('/iot/all-ajax',isAuthenticated,async (req, res)=>{
    limit= req.query.limit || 10
    var graf=[];
    const user= req.user.id;
    const topicos = await Sensor.distinct("topic", {"user":user});
    //console.log(top)
    //const graf= await Meas.find(paramsall).sort({$natural:-1}).limit(limit).lean()
   
    const sensors = await Meas.find(params).sort({$natural:-1}).limit(1);
    const sp= await Meas
    .find({topic:"600e45126a122a4a20fdb07c/Sensor/afcc9f72-ca97-457a-890d-363ca1b98a4a"})
    .sort({$natural:-1}).limit(1).lean(); 
    const lastopen= await Meas
    .find({topic:"600e45126a122a4a20fdb07c/Sensor/afcc9f72-ca97-457a-890d-363ca1b98a4a", value:"1"})
    .sort({$natural:-1}).limit(1).lean(); 
    const st= await Meas
    .find({topic:"600e45126a122a4a20fdb07c/Sensor/ac184b65-fbc2-4192-864c-04111dbf5290"})
    .sort({$natural:-1}).limit(1).lean(); 
    //console.log("sensor de temperatura :",st);
    //json_graph=await fs.writeFileSync('src/graph.json',graf);
    //await fs.writeJson('src/graph.json', graf)
    //var graf= await Meas.find(paramsall).sort({$natural:-1}).limit(limite).lean();
    //var graf= await Measm.connection.query(query);
    Measm.connection.query(query, function(err, graf1, fields) {
       // console.log(graf1)
        graf=graf1;
        res.json({sensors,topicos,sp,st,lastopen,graf});
    });
    
    
})

router.get('/iot/devices', isAuthenticated, async (req, res)=>{
    const user=req.user.id;
    const name=req.user.name;
    const query = await Sensor.distinct("topic");
    //console.log("consulta",query);
    const sensors = await Sensor.find({user:user, topic:query}).limit(query.length).lean();
    res.render('iot/devices',{sensors,name});
})
module.exports  =   router;

