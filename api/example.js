var express = require('express');
var db = require('../db');
var products = express.Router();
var multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        // You could rename the file name
        // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))

        // You could use the original name
        cb(null, file.originalname)
    }
});

var upload = multer({storage: storage});

//set products and file
products.post('/products', upload.single('file'),async (req, res) => {
    
    let name = req.body.name;
    let picture = req.file.filename;
    let currency = req.body.currency;
    let price = req.body.price;
    let offert = req.body.offert;
    let description = req.body.description;

    if(!name)
        return res.status(400).send({
            error:true, message:'Invalid'
        })

        db.query('INSERT INTO products (name, picture, currency, price, offert, description) VALUES(?, ?, ?, ?, ?, ?)', 
   
        [name, picture, currency, price, offert, description], (error, results, fields) => {
            if(error) throw error;
            return res.send({error:false, data:results, message:'Products add successfully!'})
        })
});

module.exports = products;