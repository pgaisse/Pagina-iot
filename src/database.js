const mongoose  = require('mongoose');
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/notes-db-app',{
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false

})
.then(db=>console.log('connected'))
.catch(err=>console.err(err));