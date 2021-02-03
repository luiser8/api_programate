var express = require('express');
var db = require('../db');
var presentation = express.Router();

//get home
presentation.get('/presentation', async (req, res) => {
    db.query('SELECT * FROM presentation WHERE status = ?', 1, (error, results, fields) => {
        if(error) throw error;

        let message = '';
        if(results === undefined || results.length == 0)
            message = 'Presentation table is empty'
        else
            message = 'Successfully'

        return res.send({error: false, data: results, message: message})
    })
})


module.exports = presentation;