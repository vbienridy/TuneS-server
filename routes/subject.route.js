const subjectDao = require("../daos/subject.dao");
const userDao = require("../daos/user.dao");


module.exports=app=>{
    app.put('/api/subject/:subjectId', function(req, res){
    console.log('mi1')
    if (!req.user){
      return res.status(500).send('user not loggedin')
    }
    console.log('mi2')
    
    userDao.findUserById(req.user.profile.id, (err, user)=>{ //check wether user is editor in database
        if (err){
            return res.status(500).send(err);
        }
        if (!user){
            return res.status(500).send("user not exist");
        }
        if (user.type!==2){
            return res.status(500).send('user is not editor')
        }
        // console.log('mi3')
        if (req.body.type==="album"){ //make sure other fields are not updated by someone
        subjectDao.update(req.params.subjectId, {intro: req.body.intro})
            .then( (data)=>{ console.log('suc'); return res.json({message: 'success'}) } ).catch((err)=>{console.log(err);res.status(500).send('update error')})
        }
    })
  })

  app.get('/api/subject/:subjectId', function(req, res){

    subjectDao.findSubjectById(req.params.subjectId)
        .then((subject)=>{ if(!subject) {return res.json({intro: ""})}; return res.json(subject) }).catch((err)=>res.status(500).send('update error'))
    
  })
}