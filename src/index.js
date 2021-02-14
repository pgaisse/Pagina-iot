const express   =   require('express');
const path      =   require('path');
const exphbs    =   require('express-handlebars');
const methodOverride = require('method-override');
const session   =   require('express-session');
const flash     =   require('connect-flash');
const Chart     =   require('chart.js');
const passport  =   require('passport');
const moment    =   require('node-moment');
var user      = {};
///////////////////////////////////hola mundo
var     mqtt     = require('mqtt');
const Sensor    =   require('./models/Iot');
const Meas    =   require('./models/Meas');
const {isAuthenticated} = require('./helpers/auth');
///////////////////////////////////deve

// Initializations
const app = express();
require('./database');
require('./config/passport');

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs', exphbs({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'

}));
app.set('view engine', '.hbs');

//middleawares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret:'mysecretapp',
    resave:true,
    saveUninitialized: true

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global Variables
app.use((req,res,next)=>{
    res.locals.success_msg= req.flash('success_msg');
    res.locals.error_msg= req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || 0;
    next();
});
//Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));
app.use(require('./routes/iot'));
//static Files

app.use(express.static(path.join(__dirname, 'public')));






//server is listenning a



async function mqtt_p(){
    var broker='mqtt://190.114.254.218';

    var client = mqtt.connect(broker, {
        username: 'telemetria',
        password: 'telemetria.2021' 
    });
    await client.on('connect', async(req,res) =>{
        await client.subscribe('+/sensores/#')
        await client.subscribe('+/actuadores/#')
        //await client.subscribe('patricio/sensores/#')
    const top1= client._resubscribeTopics;
    console.log("suscrito a : ",top1);
    })
    
    
//recibir y guardar datos del arduino por medio de mqtt
    client.on('message', async function (topic, message) {
            var value=message.toString();
            var user=topic.substring(0, topic.indexOf("/"));
            var date=moment().format('hh:mm:ss DD/MM/YY');
            const newSensor   =  await new Meas({topic,value});
            await newSensor.save();     
        })
}

mqtt_p();
app.listen(app.get('port'), ()=>{
console.log('Server on port ',app.get('port'));

});