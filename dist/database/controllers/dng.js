"use strict";
const dng = require('../models/dng.js');
const conn = require('../index.js');
module.exports = {
    getTopic: (req, res) => {
        const topic = req.params;
        dng.find(topic)
            .then((result) => {
            res.send(result[0]);
        });
    },
    getTopics: (req, res) => {
        dng.find().select('topic')
            .then((result) => {
            res.send(result);
        })
            .catch((err) => console.log(err));
    },
    postTopic: (req, res) => {
        dng.create(req.body)
            .then((result) => {
            res.send(result);
        })
            .catch((err) => console.log(err));
    }
};
