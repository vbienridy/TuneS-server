const commentDao = require("../daos/comment.dao");

module.exports = app => {
  // create comment
  app.post("/api/subject/:type/:id/comment", function(req, res) {
    commentDao.createComment(
      req.user.profile.id, //userId
      req.body.subject,
      req.body.commentContent, // comment
      res
    );
  });

  // find comments by subject id
  app.get("/api/subject/:type/:id/comments", function(req, res) {
    commentDao.findCommentsBySubjectId(
      req.params.id,
      res
    );
  });

  // find comments by user id
  app.get("/api/user/:id/comments", function(req, res) {
    commentDao.findCommentsByUserId(
      req.params.id,
      res
    );
  });

  // update comment
  app.put("/api/current/comment/:id", function(req, res) {
    commentDao.updateComment(req.user.profile.id, req.body, res);
  });

  // delete comment
  app.delete("/api/current/comment/:id", function(req, res) { 
    commentDao.deleteComment(req.user.profile.id, req.params.id, res);
  });

};
