//this file contains the endpoint to CRUD diagnoses in the database
const DiagnoseSchema = require('../models/Diagnose.js');
const passport = require('passport');

module.exports.controller = (app) => {
// fetch all diagnoses
app.get('/diagnoses',passport.authenticate('jwt', { session: false }), (req, res) => {
    DiagnoseSchema.find({}, 'diagnose', (error,
    diagnoses) => {
    if (error) { console.log(error); }
    res.send({
    diagnoses,
    });
    });
    });

//delete diagnose from the database

app.delete('/diagnoses/:id', passport.authenticate('jwt', { session: false }),(req, res) => {
  DiagnoseSchema.remove({
      _id: req.params.id 
  }, function(error, diagnose){
      if (error){console.error(error);}
      res.send({success:true})
  })
  });
    




// add a new diagnose
app.post('/diagnoses', passport.authenticate('jwt', { session: false }),(req, res) => {
const newDiagnose = new DiagnoseSchema({
        diagnose: req.body.diagnose,

});

newDiagnose.save((error, diagnose) => {
if (error) { console.log(error); }
res.send(diagnose);
});
});
};



    

