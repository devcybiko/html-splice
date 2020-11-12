#!/usr/bin/env node
const { parse, valid } = require('node-html-parser');
const path = require("path");
const glstools = require('glstools');
const gfiles = glstools.files;
const clipargs = require("./clipargs.js");

function die(msg, rc=1) {
    console.error(msg);
    process.exit(rc);
}

function getNodes(node, query, all=false) {
    let nodes = {};
    if (all) nodes = node.querySelectorAll(query);
    else nodes = node.querySelector(query);
    return nodes;
}

function cond(node, conditions) {
    if (!conditions) return true;
    let result = true;
    for(let cond of conditions) {
        result = result && eval(`${cond}`);
        if (!result) break;
    }
    // console.log({result});
    return result;
}

function action(node, actions) {
    let result = "";
    for(let action of actions) {
        result += eval(`${action}`);
    }
    // console.log(result);
    return result;
}

function deleteNode(node) {
    node.parentNode.removeChild(node);
}
function deleteParent(node) {
    deleteNode(node.parentNode);
}
function deleteGrandParent(node) {
    deleteParent(node.parentNode);
}

function main() {
    let opts = clipargs("-all,-query,-action,-cond,infile,query");
    //  console.log(opts);

    let html = gfiles.read(opts.infile);
    let root = parse(html);
    let nodes = getNodes(root, opts.query, opts.all);
    for(let node of nodes) {
        if (cond(node, opts.cond)) action(node, opts.action);
    }
    // console.log(nodes.length);
    console.log(root.toString());
}

main();