const router    =   require('express').Router();
const Note =require('../models/Note');
const {isAuthenticated} = require('../helpers/auth')

router.get('/notes/add',isAuthenticated, (req, res)=>{
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async (req,res)=>{
    console.log(req.body);
    const {title, description}=req.body;
    const errors=[];
    if(!title){
        errors.push({text: 'por favor revise el título'});
    }
    if(!description){
        errors.push({text: 'por favor revise el descripción'});
    }
    if(errors.length > 0){
        res.render('notes/new-note',{
            errors,
            title,
            description
        });

    }
    else{
        const newNote   =   new Note({title, description});
        newNote.user = req.user.id;
        //
        console.log(newNote);
        await newNote.save();
        req.flash('success_msg', 'Nota agregada satisfactoriamente');
        res.redirect('/notes');
    }
});
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    await Note.findById(req.params.id).then(datos=>{
        title=datos.title;
        description=datos.description;
        id=datos.id;
        console.log(title);
        console.log(description);

         
    res.render('notes/edit-note',{title,description,id})
    })
});

router.get('/notes', isAuthenticated, async (req, res) => {
    await Note.find({user: req.user.id}).then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
            return {
                title: documento.title,
                description: documento.description,
                id: documento.id
            }   
          })
        }
        res.render('notes/all-notes', {
 notes: contexto.notes }) 
      })
  })
router.put('/notes/edit-note/:id',isAuthenticated, async (req,res)=>{
    const {title, description}  =   req.body;
    await Note.findByIdAndUpdate(req.params.id,{title, description})
    req.flash('success_msg', 'Nota editada satisfactoriamente');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id',isAuthenticated, async (req,res)=>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Nota eliminada satisfactoriamente');
    res.redirect('/notes');
});

module.exports  =   router;