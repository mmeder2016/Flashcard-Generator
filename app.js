var fs = require("fs");

var BasicFlashcard = require("./BasicFlashcard");
var ClozeFlashcard = require("./ClozeFlashcard");

var basicFile = "BasicFlashcard.json";
var clozeFile = "ClozeFlashcard.json";

var basic = []; // Array of BasicFlashcard objects
var cloze = []; // Array of ClozeFlashcard objects

initFlashcardsFromFile();

function initFlashcardsFromFile() {
    basic = jsonObjFromFile(basicFile);
    console.log(basic);

    cloze = jsonObjFromFile(clozeFile);
    console.log(cloze);
}

// UTILITY FUNCTIONS
// jsonObj - JSON object to initialize from file
// fn filename
function jsonObjFromFile(fn) {
    // console.log(typeof jsonObj);
    // console.log(Array.isArray(jsonObj));
    var jsonObj = null;
    try {
        var data = fs.readFileSync(fn, 'utf-8');
        if (data) {
            jsonObj = JSON.parse(data);
        } else {
            console.log(basicFile + ": no data");
        }
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('File not found:' + basicFile);
        } else {
            throw err;
        }
    }
    return jsonObj;
}

// jsonObj - JSON object to write to file
// fn - filename
function jsonObjToFile(jsonObj, fn) {
    var json = JSON.stringify(jsonObj);
    fs.writeFile(fn, json, 'utf8', function(err) {
        if (err) {
            console.error(err);
        }
    });
}

// TEST FUNCTIONS
function testAddClozeFlashCard() {
    // cd cloze-deleted flashcards
    var cd_front = " was the first president of the United States?";
    var cd_back = "George Washington";

    var MyClozeFlashcard = new ClozeFlashcard(cd_front, cd_back);
    cloze.push(MyClozeFlashcard);
    jsonObjToFile(cloze, clozeFile);
}

function testAddBasicFlashCard() {
    //b basic flashcards
    var b_front = "Who was the first president of the United States?";
    var b_back = "George Washington";

    var MyBasicFlashcard = new BasicFlashcard(b_front, b_back);
    basic.push(MyBasicFlashcard);
    jsonObjToFile(basic, basicFile);
}