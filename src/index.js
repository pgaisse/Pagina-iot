const express   =   require('express');
const path      =   require('path');
const exphbs    =   require('express-handlebars');
const methodOverride = require('method-override');
const session   =   require('express-session');
const flash     =   require('connect-flash');
const Chart     =   require('chart.js');
const passport  =   require('passport');
const moment    =   require('node-moment');
const morgan    =   require('morgan');
var user      = {};
var count=0;
///////////////////////////////////hola mundo
var     mqtt     = require('mqtt');
const Sensor    =   require('./models/Iot');
const Meas    =   require('./models/Meas');
const Measm    =   require('./models/Measm');
const {isAuthenticated} = require('./helpers/auth');
///////////////////////////////////deve

// Initializations
const app = express();
require('./database');
require('./config/passport');



//middleawares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(session({
    secret:'mysecretapp',
    resave:true,
    saveUninitialized: true

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(morgan('dev'));


//Global Variables
app.use((req,res,next)=>{
    res.locals.success_msg= req.flash('success_msg');
    res.locals.error_msg= req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || 0;
    next();
});


//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs', exphbs({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: {
        user: function() {
          return app.locals.user;
        },
        ifCond: function(v1, v2, options) {
            if(v1 === v2) { 
                return options.fn(this); 
            } 
            return options.inverse(this); 

        },
        dateday: function(date, options) {
            const dateday = new Date(date)
            return dateday.getHours()+":"+dateday.getMinutes()+":"+dateday.getSeconds(); 
        }
      }

}));



app.set('view engine', '.hbs');




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
        await client.subscribe('+/Sensor/#')
        await client.subscribe('+/Actuador/#')
        //await client.subscribe('patricio/sensores/#')
    const top1= client._resubscribeTopics;
    console.log("suscrito a : ",top1);
    })
    
    
//recibir y guardar datos del arduino por medio de mqtt
    client.on('message', async function (topic, message) {
            date =new Date;
            var value=message.toString();
            const newSensor   =  await new Meas({topic,value});
            const query =   'insert into meas (topic, value) values ( "'+topic+'", "'+value+'")';
            await Measm.connection.query(query);
            await newSensor.save();  
            /*if (count%60==0){
                const newSensor   =  await new Meas({topic,value,interval:"m_1"});
                await newSensor.save(); 
            }
            if (count%600==0){
                const newSensor   =  await new Meas({topic,value,interval:"m_10"});
                await newSensor.save(); 
            }
            if (count%3600==0){
                const newSensor   =  await new Meas({topic,value,interval:"h_1"});
                await newSensor.save(); 
            }
           // console.log("topic :",topic, "  Value: ", value);
            count++;
            console.log(count);*/
        })
}

mqtt_p();
app.listen(app.get('port'), (req, res)=>{
console.log('Server on port ',app.get('port'));

});