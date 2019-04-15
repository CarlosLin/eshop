var createError = require('http-errors')
var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
var mysql = require('mysql')


// Db import
var app = express()

// view engine setup
// app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.json())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

// Db Connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "10160507",
  database: "eshop",
})
con.connect(function(err){
  if (err) {
    console.log(err)
    return;
  }
  console.log('connectioning success')
})

// DB state
app.use(function(req, res, next) {
  req.con =con
  next()
})


// API

// 全部商品
app.get('/item', (req, res) => {
  con.query('SELECT * FROM Item', function(err, rows) {
    if (err) throw err;
    console.log(rows)
    res.status(200).send(rows)
  })
})

// 新增商品
app.post('/item', (req, res) => {
  var db = req.con
  var name = req.body.name
  var price = req.body.price
  var type = req.body.type
  var newItem = {
    name: name,
    type: type,
    price: price
  }
  con.query('INSERT INTO Item SET ?', newItem, function(req, result) {
  if (req) {
    console.log(req)
  }
  console.log(result)
  res.status(200).send(result)
  })
})

// 取得符合環境事件相關的優惠
app.post('/promotion', (req, res) => {
  var db = req.con
  var nowDate = req.body.date
  con.query('SELECT * FROM PROMOTION WHERE startDate <=\''+nowDate+'\' and endDate >=\''+nowDate+'\'', function(req, result) {
    if (req) {
      console.log(req)
    }
    console.log(result)
    res.status(200).send(result)
  })
})

// 新增優惠
app.post('/addPromotion', (req, res) => {
  var db = req.con
  var newPromotion = {
    type: req.body.type,
    discount: req.body.discount,
    startDate: req.body.start,
    endDate: req.body.end
  }
  con.query('INSERT INTO PROMOTION SET ?', newPromotion, function(req, result) {
    if (req) {
      console.log(req)
    }
    console.log(result)
    res.status(200).send(result)
  })
})

// 驗證折價卷
app.post('/checkCoupon', (req, res) => {
  var db = req.con
  console.log(req.body)
  var getCoupon = req.body.sn
  var date = req.body.date
  con.query('SELECT * FROM COUPON WHERE sn =\''+ getCoupon + '\'',function(req, result) {
    if(req) {
      console.log(req)
    }
    if(result.length === 0) {
      res.status(200).send({
        code: 003,
        message: 'Wrong Coupon'
      })
    }else if(Date.parse(result[0].endDate).valueOf() < Date.parse(date).valueOf()){
      res.status(200).send({
        code: 002,
        message: 'expired'
      })
    }else {
      res.status(200).send({
        code: 001,
        message: 'Success!'
      })
    }
  })
})

// 新增折價卷
app.post('/addCoupon', (req, res) => {
  var db = req.con
  var newCoupon = {
    sn: req.body.sn,
    endDate: req.body.end
  }
  con.query('INSERT INTO COUPON SET ?', newCoupon, function(req, result) {
    if (req) {
      console.log(req);
    }
    console.log(result)
    res.status(200).send(result)
  })
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(500).json({
    message: err.message,
    error: err
  })
})

module.exports = app
