var fs = require("fs");
var BasicFlashcard = require("./BasicFlashcard");
var ClozeFlashcard = require("./ClozeFlashcard");

// JSON files containing the BasicFlashcard that have been added.
var basicFile = "BasicFlashcard.json";
var clozeFile = "ClozeFlashcard.json";
// Array of BasicFlashcard objects that will be initialized from a json
// file when the application starts. If a new BasicFlashcard is added to
// this array, it will immediately be written to file.
var basic = [];
// Array of ClozeFlashcard objects that will be initialized from a json
// file when the application starts. If a new ClozeFlashcard is added to
// this array, it will immediately be written to file.
var cloze = [];

// Variables set from command line parameters
var cmdlnCardType = null; // 'basic' or 'cloze'
var cmdlnAction = null; // 'add' or 'display'
var cmdlnAddArg1 = null;
var cmdlnAddArg2 = null;

// RUN CODE
try {
    // Get the command line parameters
    var params = process.argv.slice(2);
    // getParams - sets 4 cmdln variables 
    getParams(params); // throws on errors

    // Populates the basic[] and cloze[] from the corresponding JSON files
    basic = jsonObjFromFile(basicFile); // throws on errors other than 'ENOENT'
    cloze = jsonObjFromFile(clozeFile); // throws on errors other than 'ENOENT'

    // At this point we have validated the command line arguments and can 
    // assume the are what we expect
    if (cmdlnCardType === 'basic') {
        if (cmdlnAction === 'add') {
            addBasicFlashcard(cmdlnAddArg1, cmdlnAddArg2);
        } else if (cmdlnAction === 'display') {
            displayBasicFlashCard();
        } else {
            throw ("Error in running commands for " + cmdlnCardType);
        }
    } else if (cmdlnCardType === 'cloze') {
        if (cmdlnAction === 'add') {
            addClozeFlashcard(cmdlnAddArg1, cmdlnAddArg2);
        } else if (cmdlnAction === 'display') {
            displayClozeFlashCard();
        } else {
            throw ("Error in running commands for " + cmdlnCardType);
        }
    } else {
        throw ("Error in running commands for card types");
    }
} catch (err) {
    console.log(err);
}

function getKeypress() {

}

function displayBasicFlashCard() {
    if (basic.length !== 0) {
        var rand = Math.floor((Math.random() * basic.length));
        console.log(basic[rand].front);
        console.log(basic[rand].back);
    }
}

function displayClozeFlashCard() {
    if (cloze.length !== 0) {
        var rand = Math.floor((Math.random() * cloze.length));
        console.log(cloze[rand].text);
        console.log(cloze[rand].cloze);
    }
}

// fn filename
// returns a JSON object initialed from file
function jsonObjFromFile(fn) {
    var jsonObj = [];
    try {
        var data = fs.readFileSync(fn, 'utf-8');
        if (data) {
            jsonObj = JSON.parse(data);
        } else {
            console.log(basicFile + ": no data");
        }
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('File not found:' + fn);
        } else {
            throw err;
        }
    }
    return jsonObj;
}

// jsonObj - JSON object to write to file
// fn - filename to write
function jsonObjToFile(jsonObj, fn) {
    var json = JSON.stringify(jsonObj);
    fs.writeFile(fn, json, 'utf8', function(err) {
        if (err) {
            console.error("function jsonObjToFile" + err);
        }
    });
}

// Adds a BasicFlashcard to the basic[] and immediately writes its contents
// to file
function addBasicFlashcard(f, b) {
    var MyBasicFlashcard = new BasicFlashcard(f, b);
    basic.push(MyBasicFlashcard);
    jsonObjToFile(basic, basicFile);
}
// Adds a ClozeFlashcard to the basic[] and immediately writes its contents
// to file
function addClozeFlashcard(f, b) {
    var MyClozeFlashcard = new ClozeFlashcard(f, b);
    cloze.push(MyClozeFlashcard);
    jsonObjToFile(cloze, clozeFile);
}

function getParams(params) {
    var USAGE_STR = ' node basic add \"front\" \"back\"\n node cloze add \"text\" \"cloze\"\n' + ' node basic display\n node cloze display';
    var errorStr = "\ncommand line error: ";
    var paramError = false;
    if (params.length === 2 || params.length === 4) {
        if (params[0] === 'basic' || params[0] === 'cloze') {
            cmdlnCardType = params[0];
            if (params.length === 2 && params[1] == 'display') {
                cmdlnAction = params[1];
            } else if (params.length === 4 && params[1] == 'add') {
                cmdlnAction = params[1];
                cmdlnAddArg1 = params[2];
                cmdlnAddArg2 = params[3];
            } else {
                errorStr += "Bad arg: " + params[1];
                paramError = true;
            }
        } else {
            errorStr += "Bad arg: " + params[0];
            paramError = true;
        }
    } else {
        errorStr += " Wrong number of arguments.";
        paramError = true;
    }
    if (paramError) {
        throw (errorStr + '\n' + USAGE_STR);
    }
}