# TuneS
npm start dev
dev configured with local mongodb
prod configured with heroku env mongodb
mongodb local: mongod --port 12345

1.user not in session- error
2.user in session but not in database --error
3. user in session and in database --OK

find by string for onjectId is OK, object is will go to frontend string
but set string as objectId in ref is not OK, need  ObjectId(string) to convert
#
saveUser in user.dao.js changed to transactional database access, han's previous change is not transactional, thus may lead to unexpected database change
 = (user, callback) => {
  return userModel.collection.update({sid: payload.profile.id}, { $setOnInsert: user },
    { upsert: true }, (err, res)=>{ if(err){return}; callback() })


in comment.dao.js, change create to save, create may lead to error since that createComment function is not transcational
change some other create to save for same reasons

in comment.dao.js, han's deleteComment and updatecomment are changed,
since we must verify that commentId belongs to user in this session, frontend information is not ok for verification


