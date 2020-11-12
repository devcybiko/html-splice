#!/usr/bin/env node
const { parse } = require('node-html-parser');
const path = require("path");
const glstools = require('glstools');
const gfiles = glstools.files;
const clipargs = require("./clipargs.js");

function main() {
    let opts = clipargs("-parent","-cut","-all");
    console.log(opts);
}

main();