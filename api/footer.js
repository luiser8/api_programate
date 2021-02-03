var express = require('express');
var db = require('../db');
var footer = express.Router();

//get footer
footer.get('/footer', async (req, res) => {
    db.query('SELECT * FROM footer', (error, results, fields) => {
        if(error) throw error;

        let message = '';
        if(results === undefined || results.length == 0)
            message = 'Footer table is empty'
        else
            message = 'Successfully'

        return res.send({error: false, data: results, message: message})
    })
})

//get footer items
footer.get('/footer_item/:id', async (req, res) => {
    let id = req.params.id;
    db.query('SELECT footer_item.* FROM footer INNER JOIN footer_item ON footer.id_footer = footer_item.id_footer WHERE footer.id_footer=?', id, (error, results, fields) => {
        if(error) throw error;

        let message = '';
        if(results === undefined || results.length == 0)
            message = 'Footer Items table is empty'
        else
            message = 'Successfully'

        return res.send({error: false, data: results, message: message})
    })
})

//get footer id
footer.get('/footer/:id', async (req, res) => {
    let id = req.params.id;

    if(!id){
        return res.status(400).send({error: true, message:'Please provide product id'})
    }

    db.query('SELECT * FROM footer WHERE id_footer=?', id, (error, results, fields) => {
        if(error) throw error;

    let message = '';
    if(results === undefined || results.length == 0)
        message = 'footer not found';
    else
        message = 'Successfully retrived footer data';

        return res.send({error: false, data: results, message: message})
    })
})

//set footer and file
footer.post('/footer', async (req, res) => {
    let name = req.body.name;
    let description = req.body.description;

    if(!name)
        return res.status(400).send({
            error:true, message:'Invalid'
        })

        db.query('INSERT INTO footer (name, description) VALUES(?, ?)', 
   
        [name, description], (error, results, fields) => {
            if(error) throw error;
            return res.send({error:false, data:results, message:'Footer add successfully!'})
        })
})

// update footer with id
footer.put('/footer', async (req, res) => {
    let name = req.body.name;
    let description = req.body.description;

    // validation
    if (!id || !name) {
        return res.status(400).send({ error: true, message: 'Please provide product id, name' });
    }

    db.query("UPDATE footer SET name = ? ,description = ? WHERE id_footer = ?", [name, description, id], (error, results, fields) => {
        if (error) throw error;

        // check data updated or not
        let message = "";
        if (results.changedRows === 0)
            message = "Footer not found or data are same";
        else
            message = "Footer successfully updated";

        return res.send({ error: false, data: results, message: message });
    });
});

// delete footer by id
footer.delete('/footer', async (req, res) => {

    let id = req.body.id_footer;

    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide footer id' });
    }
    db.query('DELETE FROM footer WHERE id_footer = ?', [id], (error, results, fields) => {
        if (error) throw error;

        // check data updated or not
        let message = "";
        if (results.affectedRows === 0)
            message = "Footer not found";
        else
            message = "Footer successfully deleted";

        return res.send({ error: false, data: results, message: message });
    });
});


module.exports = footer;