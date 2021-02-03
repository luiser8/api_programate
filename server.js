var express = require('express');
var createError = require('http-errors');
var body_parser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var path = require('path');

var navRouter = require('./api/nav');
var footerRouter = require('./api/footer');
var userRouter = require('./api/user');
var homeRouter = require('./api/home');
var presentationRouter = require('./api/presentation');
var courseRouter = require('./api/course')

var app = express();
app.use(morgan('combined'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true
}));
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '/public')));

//Routes layouts
app.use('/api/layout', navRouter);
app.use('/api/layout', footerRouter);
app.use('/api/auth', userRouter);
//Home
app.use('/api', homeRouter);
app.use('/api', presentationRouter);

//Course
app.use('/api', courseRouter);

//Home
app.get('/', (req, res) => {
    return res.render('index', { error: false, message:'API REST' })
});


//catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

//error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//set port
app.listen(8000, () => {
    console.log('Node port 8000');
});

module.exports = app;