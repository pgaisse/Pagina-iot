const mongoose =   require('mongoose');
var moment = require('moment');
const mongoosePaginate= require('mongoose-paginate-v2');

const { Schema }  =   mongoose;

const MeasSchema =  new Schema({
    value:{type: Number, require:false},
    date: {type: Date, default: Date.now },
    topic: {type: String, require: true},
    interval:{type: String, require:false}
});
MeasSchema.plugin(mongoosePaginate);
module.exports=mongoose.model('Meas', MeasSchema);