var express = require('express');
var md5 = require('md5');
var db = require('../db');
var mail = require('./mail')
var user = express.Router();

//get all users
user.get('/user', async (req, res) => {
    db.query('SELECT * FROM users', (error, results, fields) => {
        if(error) throw error;

        let message = '';
        if(results === undefined || results.length == 0)
            message = 'User table is empty'
        else
            message = 'Successfully'

        return res.send({error: false, data: results, message: message})
    })
})

//get user for id
user.get('/user/:id', async (req, res) => {
    let id = req.params.id;

    if(!id){
        return res.status(400).send({error: true, message:'Please provide user id'})
    }

    db.query('SELECT * FROM users WHERE id_user=?', id, (error, results, fields) => {
        if(error) throw error;

    let message = '';
    if(results === undefined || results.length == 0)
        message = 'User not found';
    else
        message = 'Successfully retrived nav data';

        return res.send({error: false, data: results, message: message})
    })
})

//Check user exist
user.get('/user/login/:username', async (req, res) => {
    let user = req.params.username;
    let username = user.substring(1, parseInt(req.params.username.length));
    let field = '';

    if(user.substr(0, 1) == 'u')
        field = 'username'
    else if(user.substr(0, 1) == 'e')
        field = 'email'

    if(!user){
        return res.status(400).send({error: true, message:'Please provide user username'})
    }

    db.query(`SELECT id_user, ${field} FROM users WHERE ${field}=?`, username, (error, results, fields) => {
        if(error) throw error;

    let message = '';
    if(results === undefined || results.length == 0)
        message = 'User not found';
    else
        message = 'Successfully retrived user data';

        return res.send({error: false, data: results, message: message})
    })
})

//set login
user.post('/user/login', async (req, res) => {
    let username = req.body.username;
    let password = md5(req.body.password);

    if(!username || !password)
        return res.status(400).send({
            error:true, message:'Invalid'
        })

        db.query('SELECT * FROM users WHERE username=? AND password=? AND status=?', [username, password, 1],(error, results, fields) => {
            if(error) throw error;
    
        let message = '';
        if(results === undefined || results.length == 0)
            message = 'User not found';
        else
            message = 'Successfully retrived nav data';
    
            return res.send({error: false, data: results, message: message})
        })
})

//set token recuperation
user.post('/user/token', async (req, res) => {
    let id_user = req.body.id_user;
    let email = req.body.email;
    let token = Math.floor(Math.random() * 1000000);

    if(!email || !id_user)
        return res.status(400).send({
            error:true, message:'Invalid'
        })

        db.query('INSERT INTO token (id_user, email, token, status) VALUES(?, ?, ?, ?)', 
        [id_user, email, token, 1], (error, results, fields) => {
            if(error) throw error;
            return res.send({error:false, data:results, message:'User token add successfully!'})
        })
        await mail(email, 'Token de recuperacion', token);
})

//Token code check validation
user.post('/user/token/check', async (req, res) => {
    let id_user = req.body.id_user;
    let id_token = req.body.token;
    let token = req.body.code;

    if(!id_user || !token)
        return res.status(400).send({
            error:true, message:'Invalid'
        })

        db.query('SELECT * FROM token WHERE id_user=? AND id_token =? AND token=? AND status=?', [id_user, id_token, token, 1],(error, results, fields) => {
            if(error) throw error;
    
        let message = '';
        if(results === undefined || results.length == 0)
            message = 'User token not found';
        else
            message = 'Successfully retrived user token data';
            return res.send({error: false, data: results, message: message})
        })
})

//Deleting token change new password
user.delete('/user/token/delete', async (req, res) => {

    let token = req.body.id_token;
    let user = req.body.id_user;

    if (!token) {
        return res.status(400).send({ error: true, message: 'Please provide token id' });
    }
    db.query('DELETE FROM token WHERE id_token = ? AND id_user = ? ', [token, user], (error, results, fields) => {
        if (error) throw error;

        let message = "";
        if (results.affectedRows === 0)
            message = " Token not found";
        else
            message = "Token successfully deleted";
        return res.send({ error: false, data: results, message: message });
    });
});

//set new user
user.post('/user/add', async (req, res) => {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let username = req.body.username;
    let password = md5(req.body.password);
    let email = req.body.email;
    let phone = req.body.phone;
    let address = req.body.address;
    let avatar = 'user.png';

    if(!username || !password)
        return res.status(400).send({
            error:true, message:'Invalid'
        })

        db.query('INSERT INTO users (first_name, last_name, username, password, email, phone, address, avatar) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', 
        [first_name, last_name, username, password, email, phone, address, avatar], (error, results, fields) => {
            if(error) throw error;
            return res.send({error:false, data:results, message:'User add successfully!'})
        })
        await mail(email, 'Registro de usuario', false);
})

//check old password
user.post('/user/checkoldpassword', async (req, res) => {
    let id_user = req.body.id_user;
    let password = md5(req.body.password);

    if(!id_user || !password)
        return res.status(400).send({
            error:true, message:'Invalid'
        })

        db.query('SELECT id_user FROM users WHERE id_user=? AND password =? AND status=?', [id_user, password, 1],(error, results, fields) => {
            if(error) throw error;
    
        let message = '';
        if(results === undefined || results.length == 0)
            message = 'User password not found';
        else
            message = 'Successfully retrived user password data';
            return res.send({error: false, data: results, message: message})
        })
})

//Change password
user.put('/user/newpassword', async (req, res) => {
    let id_user = req.body.id_user;
    let password = md5(req.body.password);

    if(!id_user || !password)
        return res.status(400).send({
            error:true, message:'Invalid'
        })

        db.query("UPDATE users SET password = ? WHERE id_user = ?", 
        [password, id_user], (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results.changedRows === 0)
                message = "Nav not found or data are same";
            else
                message = "Nav successfully updated";
            return res.send({ error: false, data: results, message: message });
        })
        //await mail(email, 'Registro de usuario', false);
})
//Update data user
user.put('/user/update', async (req, res) => {
    let id_user = req.body.id_user;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone = req.body.phone;
    let address = req.body.address;

    if(!id_user)
        return res.status(400).send({
            error:true, message:'Invalid'
        })

        db.query("UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ? WHERE id_user = ?", 
        [first_name, last_name, email, phone, address, id_user], (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results.changedRows === 0)
                message = "User not found or data are same";
            else
                message = "User successfully updated";
            return res.send({ error: false, data: results, message: message });
        })
})

module.exports = user;