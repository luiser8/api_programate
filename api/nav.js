var express = require('express');
var db = require('../db');
var nav = express.Router();

//get nav
nav.get('/nav', async (req, res) => {
    db.query('SELECT * FROM nav', (error, results, fields) => {
        if(error) throw error;

        let message = '';
        if(results === undefined || results.length == 0)
            message = 'Nav table is empty'
        else
            message = 'Successfully'

        return res.send({error: false, data: results, message: message})
    })
})

//get nav id
nav.get('/nav/:id', async (req, res) => {
    let id = req.params.id;

    if(!id){
        return res.status(400).send({error: true, message:'Please provide nav id'})
    }

    db.query('SELECT * FROM nav WHERE id_nav=?', id, (error, results, fields) => {
        if(error) throw error;

    let message = '';
    if(results === undefined || results.length == 0)
        message = 'Nav not found';
    else
        message = 'Successfully retrived nav data';

        return res.send({error: false, data: results, message: message})
    })
})

//set nav
nav.post('/nav', async (req, res) => {
    let name = req.body.name;
    let type = req.body.type;
    let route = req.body.route;
    let description = req.body.description;

    if(!name || !priority || !description)
        return res.status(400).send({
            error:true, message:'Invalid'
        })

        db.query('INSERT INTO nav (name, type, route, description) VALUES(?, ?, ?, ?)', 
        [name, type, route, description], (error, results, fields) => {
            if(error) throw error;
            return res.send({error:false, data:results, message:'Nav add successfully!'})
        })
})

// update nav with id
nav.put('/nav', async (req, res) => {
    let id = req.body.id_nav;
    let name = req.body.name;
    let type = req.body.type;
    let route = req.body.route;
    let description = req.body.description;

    // validation
    if (!id || !name || !priority || !description) {
        return res.status(400).send({ error: true, message: 'Please provide nav id' });
    }

    db.query("UPDATE nav SET name = ?, type = ?, route = ?, description = ? WHERE id_nav = ?", [name, type, route, description, id], (error, results, fields) => {
        if (error) throw error;

        // check data updated or not
        let message = "";
        if (results.changedRows === 0)
            message = "Nav not found or data are same";
        else
            message = "Nav successfully updated";

        return res.send({ error: false, data: results, message: message });
    });
});

// delete nav by id
nav.delete('/nav', async (req, res) => {

    let id = req.body.id_nav;

    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide nav id' });
    }
    db.query('DELETE FROM nav WHERE id_nav = ?', [id], (error, results, fields) => {
        if (error) throw error;

        // check data updated or not
        let message = "";
        if (results.affectedRows === 0)
            message = "Nav not found";
        else
            message = "Nav successfully deleted";
        return res.send({ error: false, data: results, message: message });
    });
});

module.exports = nav;