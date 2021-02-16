const mongoose =   require('mongoose');
var moment = require('moment');
const mongoosePaginate= require('mongoose-paginate-v2');
const { Schema }  =   mongoose;

const SensorSchema =  new Schema({
    name: {type: String, required: false},
    type:{type: String, require:false},
    description: {type: String, require: false},
    date: {type: Date, default: Date.now },
    user:{type: String, required: false},
    topic: {type: String, require: true}
});

module.exports=mongoose.model('Sensor', SensorSchema);