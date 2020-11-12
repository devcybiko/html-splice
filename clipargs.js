const DEFAULT="_argv";
const assert = require('assert');

module.exports = clipargs;

function trim(s) {
    if (s[0] === '-') return trim(s.substring(1));
    return s;
}
function split(s) {
    if (!s) return ["",""];
    let i = s.indexOf("=");
    if (i >= 0) return [s.substring(0,i), s.substring(i+1)];
    return [s,""];
}

function isKey(keys, word) {
    for(let key of keys) {
        if (word === key) return trim(word);
    }
    return DEFAULT;
}

function clipargs(keywords,argv=process.argv) {
    let keys = keywords.split(",");
    let result = {};
    let positionalParams = [];
    for(let key of keys) {
        if (key[0] === '-') result[trim(key)] = "";
        else positionalParams.push(key);
    }
    result[DEFAULT]="";
    for(let arg of argv) {
        let words = split(arg);
        let key = isKey(keys, words[0]);
        result[key] = result[key] || [];
        if (key === DEFAULT) result[key].push(words[0]);
        else result[key].push(words[1]);
        //console.log({arg,key,words,result});
    }
    let argc = 2;
    for(let i=0; i<positionalParams.length; i++) {
        if (argc >= result[DEFAULT].length) break;
        result[positionalParams[i]] = result[DEFAULT][argc++];
    }
    // console.log({result});
    return result;
}

function test0() {
    let argv = ["node","clipargs"];
    let options = clipargs("--a,-b",argv);
    assert((!!options.a)===false);
    assert((!!options.a[0])===false);
    assert(options.a.length == 0);
    assert((!!options.b)===false);
    assert((!!options.b[0])===false);
    assert(options.b.length===0);
    assert.deepEqual(options._argv, ["node", "clipargs"])
    console.log({argv,options});
}
function test1() {
    let argv = ["node","clipargs","--a"];
    let options = clipargs("--a,-b",argv);
    assert((!!options.a)===true);
    assert((!!options.a[0])===false);
    assert(options.a.length === 1);
    assert((!!options.b)===false);
    assert((!!options.b[0])===false);
    assert(options.b.length === 0);
    assert.deepEqual(options._argv, ["node", "clipargs"])
    console.log({argv,options});
}
function test2() {
    let argv = ["node","clipargs","--a=1"];
    let options = clipargs("--a,-b",argv);
    assert((!!options.a)===true);
    assert((!!options.a[0])===true);
    assert(options.a[0] === "1");
    assert(options.a.length === 1);
    assert((!!options.b)===false);
    assert((!!options.b[0])===false);
    assert(options.b.length ===0);
    assert.deepEqual(options._argv, ["node", "clipargs"])
    console.log({argv,options});
}
function test3() {
    let argv = ["node","clipargs","--a=1","--a=hello","other","-b"];
    let options = clipargs("--a,-b",argv);
    assert((!!options.a)===true);
    assert((!!options.a[0])===true);
    assert(options.a.length === 2);
    assert(options.a[0] === "1");
    assert(options.a[1] === "hello");
    assert((!!options.b)===true);
    assert((!!options.b[0])===false);
    assert(options.b[0] === "");
    assert(options.b.length === 1);
    assert.deepEqual(options._argv, ["node", "clipargs","other"])
    console.log({argv,options});
}

function test4() {
    let argv = ["node","clipargs","--a=1","other","-b","-b=bye","index.html","--a=hello"];
    let options = clipargs("--a,-b",argv);
    assert((!!options.a)===true);
    assert((!!options.a[0])===true);
    assert(options.a.length === 2);
    assert(options.a[0] === "1");
    assert(options.a[1] === "hello");
    assert((!!options.b)===true);
    assert((!!options.b[0])===false);
    assert((!!options.b[1])===true);
    assert(options.b.length === 2);
    assert(options.b[0] === "");
    assert(options.b[1] === "bye");
    assert.deepEqual(options._argv, ["node", "clipargs","other","index.html"])
    console.log({argv,options});
}

function main() {
    test0();
    test1();
    test2();
    test3();
    test4();
}

//main();