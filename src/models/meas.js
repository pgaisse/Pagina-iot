const mongoose =   require('mongoose');
var moment = require('moment');

const { Schema }  =   mongoose;

const MeasSchema =  new Schema({
    value:{type: Number, require:false},
    date: {type: Date, default: Date.now },
    topic: {type: String, require: true}
});
module.exports=mongoose.model('Meas', MeasSchema);