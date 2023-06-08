"use strict";
const mg = require('mongoose');
const dngSchema = mg.Schema({
    topic: String,
    words: [String]
});
const DnG = mg.model('dng', dngSchema);
module.exports = DnG;
