var express = require('express');
var router = express.Router();
var Note = require('../model/note');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/notes', function (req, res, next) {
  var opts = {
    raw: true
  }
  if (req.session && req.session.user) {
    opts.where = {
      userid: req.session.user.id
    }
  }
  Note.findAll({
    opts
  }).then(function (notes) {
    res.send({
      status: 1,
      data: notes
    })
  }).catch(function () {
    res.send({
      status: 0,
      errorMsg: '数据库异常'
    })
  });
});

/* 添加 */
router.post('/notes/add', function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.send({
      status: 0,
      errorMsg: '请先登录'
    });
  }
  if (!req.body.note) {
    return res.send({
      status: 0,
      errorMsg: '内容不能为空'
    })
  }
  var note = req.body.note;
  var userid = req.session.user.id;
  var username = req.session.user.username;
  if (!note) {
    return res.send({
      status: 0,
      errorMsg: '内容不能为空！'
    })
  }


  Note.create({
    userid: userid,
    username: username,
    text: note
  }).then(function (data) {
    res.send({
      status: 1,
      id: data.id
    })
  }).catch(function (e) {
    res.send({
      status: 0,
      errorMsg: '数据库异常或者你没有权限'
    });
  });
});


/* 编辑 */

router.post('/notes/edit', function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.send({
      status: 0,
      errorMsg: '请先登录'
    })
  }
  var editid = req.body.id;
  var note = req.body.note;
  var userid = req.session.user.id;
  var username = req.session.user.username;
  if (!note) {
    return res.send({
      status: 0,
      errorMsg: '内容不能为空！'
    })
  }
  if (username === 'ZYmooon') {
    Note.update({
      text: note
    }, {
      where: {
        id: editid
      },
      returning: true
    }).then(function (data) {
      if (data[1] === 0) {
        return res.send({
          status: 0,
          errorMsg: '没有权限修改'
        })
      }
      res.send({
        status: 1
      })
    }).catch(function (e) {
      res.send({
        status: 0,
        errorMsg: "数据库异常或者你没有权限"
      })
    });
  } else {
    Note.update({
      text: note
    }, {
      where: {
        id: editid,
        userid: userid
      },
      returning: true
    }).then(function (data) {
      if (data[1] === 0) {
        return res.send({
          status: 0,
          errorMsg: '没有权限修改'
        })
      }
      res.send({
        status: 1
      })
    }).catch(function (e) {
      res.send({
        status: 0,
        errorMsg: "数据库异常或者你没有权限"
      })
    });
  }
})

/* 删除 */
router.post('/notes/delete', function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.send({
      status: 0,
      errorMsg: '请先登录'
    })
  }

  var deleteid = req.body.id;
  var userid = req.session.user.id;
  var username = req.session.user.username;
  if (username === "ZYmooon") {
    Note.destroy({ where: { id: deleteid } })
      .then(function(data) {
        if (data === 0) {
          res.send({ status: 1 });
        } 
      })
      .catch(function(e) {
        res.send({ status: 0, errorMsg: "数据库异常或者你没有权限" });
      });
  } else {
    Note.destroy({ where: { id: deleteid, userid: userid } })
      .then(function(data) {
        if (data === 0) {
          res.send({ status: 1 });
        }
      })
      .catch(function(e) {
        res.send({ status: 0, errorMsg: "数据库异常或者你没有权限" });
      });
  }
});

module.exports = router;