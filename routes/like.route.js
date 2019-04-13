const likeDao = require("../daos/like.dao");

module.exports = app => {
  // find subject isliked by current user
  app.get("/api/current/:type/:id/isliked", function(req, res) {
    likeDao.findSubjectIsLiked(req.user.profile.id, req.params.id, res);
  });
  
  // like subject
  app.post("/api/subject/:type/:id/like", function(req, res) {
    likeDao.likeSubject(
      req.user.profile.id,
      req.body,
      res
    );
  });

  // like comment
  app.post("/api/like/comment/:id", function(req, res) {
    likeDao.likeComment(req.user.profile.id, req.params.id, res);
  });

  // find comment likes by subject id
  app.get("/api/subject/:type/:id/likes/comment", function(req, res) {
    likeDao.findCommentLikesBySubjectId(req.params.id, res);
  });

  // find subject likes by user id
  app.get("/api/user/:id/likes/subject", function(req, res) {
    likeDao.findSubjectLikesByUserId(req.params.id, res);
  });

  // find comment likes by current user
  app.get("/api/current/likes/comment", function(req, res) {
    likeDao.findCommentLikesByUserId(req.user.profile.id, res);
  });

  // find comment likes by user id
  app.get("/api/user/:id/likes/comment", function(req, res) {
    likeDao.findCommentLikesByUserId(req.params.id, res);
  });

  // // delete subject like
  // app.delete("/api/user/:id/likes/subject", function(req, res) {
  //   likeDao.deleteSubjectLike(
  //     req.user.profile.id,
  //     req.params.id,
  //     res
  //   );
  // });

  // // delete comment like
  // app.delete("/api/user/:id/likes/comment", function(req, res) {
  //   likeDao.deleteCommentLike(
  //     req.user.profile.id,
  //     req.params.id,
  //     res
  //   );
  // });

};
