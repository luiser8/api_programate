var express = require('express');
var db = require('../db');
var course = express.Router();

//get course
course.get('/courses', async (req, res) => {
    db.query('SELECT * FROM courses WHERE status = ?', 1, (error, results, fields) => {
        if(error) throw error;

        let message = '';
        if(results === undefined || results.length == 0)
            message = 'Course table is empty'
        else
            message = 'Successfully'

        return res.send({error: false, data: results, message: message})
    })
});

course.get('/course/:id', async (req, res) => {
    let id = req.params.id;

    if(!id){
        return res.status(400).send({error: true, message:'Please provide course id'})
    }

    db.query('SELECT * FROM courses WHERE id_course=?', id, (error, results, fields) => {
        if(error) throw error;

    let message = '';
    if(results === undefined || results.length == 0)
        message = 'Course not found';
    else
        message = 'Successfully retrived course data';

        return res.send({error: false, data: results, message: message})
    })
});

course.get('/courses/:name', async (req, res) => {
    let name = req.params.name;

    if(!name){
        return res.status(400).send({error: true, message:'Please provide course name'})
    }

    db.query('SELECT * FROM courses WHERE route=?', name, (error, results, fields) => {
        if(error) throw error;

    let message = '';
    if(results === undefined || results.length == 0)
        message = 'Course not found';
    else
        message = 'Successfully retrived course data';

        return res.send({error: false, data: results, message: message})
    })
});

course.get('/courses/content/:course', async (req, res) => {
    let id = req.params.course;
    db.query('SELECT * FROM content_courses WHERE status = ? AND id_course = ? ',[1, id], (error, results, fields) => {
        if(error) throw error;

        let message = '';
        if(results === undefined || results.length == 0)
            message = 'Content table is empty'
        else
            message = 'Successfully'

        return res.send({error: false, data: results, message: message})
    })
});

course.get('/courses/content_item/:course', async (req, res) => {
    let id = req.params.course;
    db.query('SELECT content_courses_items.* FROM content_courses INNER JOIN content_courses_items ON content_courses.id_content_course = content_courses_items.id_content_course WHERE content_courses.id_content_course = ?', id, (error, results, fields) => {
        if(error) throw error;

        let message = '';
        if(results === undefined || results.length == 0)
            message = 'Content items table is empty'
        else
            message = 'Successfully'

        return res.send({error: false, data: results, message: message})
    })
});

course.get('/courses/video/:course/:id', async (req, res) => {
    let id = req.params.id;
    let course = req.params.course;
    db.query('SELECT * FROM content_courses_items WHERE id_content_courses_items = ? AND id_content_course = ?', [id, course], (error, results, fields) => {
        if(error) throw error;

        let message = '';
        if(results === undefined || results.length == 0)
            message = 'Videos items table is empty'
        else
            message = 'Successfully'

        return res.send({error: false, data: results, message: message})
    })
});

module.exports = course;