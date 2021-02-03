var express = require('express');
var db = require('../db');
var home = express.Router();

//get home
home.get('/home', async (req, res) => {
    db.query('SELECT * FROM home WHERE status = ?', 1, (error, results, fields) => {
        if(error) throw error;

        let message = '';
        if(results === undefined || results.length == 0)
            message = 'Home table is empty'
        else
            message = 'Successfully'

        return res.send({error: false, data: results, message: message})
    })
})


module.exports = home;