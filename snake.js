
// JavaScript Snake example
// Author Jan Bodnar
// http://zetcode.com/javascript/snake/

var canvas;
var ctx;

var head;
var apple;
var ball;

var dots;
var apple_x;
var apple_y;

var leftDirection = false;
var rightDirection = true;
var upDirection = false;
var downDirection = false;
var inGame = true;    

const DOT_SIZE = 10;
const ALL_DOTS = 900;
const MAX_RAND = 29;
const DELAY = 140;
const C_HEIGHT = 800;
const C_WIDTH = 1000;    

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;

var x = new Array(ALL_DOTS);
var y = new Array(ALL_DOTS);   


  

function loadImages() {
    
    head = new Image();
    head.src = 'head.png';    
  

    ball = new Image();
    ball.src = 'dot.png'; 
    
    apple = new Image();
    apple.src = 'apple.png'; 
}

function createSnake() {

    dots = 3;

    for (var z = 0; z < dots; z++) {
        x[z] = 50 - z * 10;
        y[z] = 50;
    }
}

function checkApple() {

    if ((x[0] == apple_x) && (y[0] == apple_y)) {

        dots++;
        locateApple();
    }
}    

function doDrawing() {
    
    ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    
    if (inGame) {

        ctx.drawImage(apple, apple_x, apple_y);

        for (var z = 0; z < dots; z++) {
            
            if (z == 0) {
                ctx.drawImage(head, x[z], y[z]);
            } else {
                ctx.drawImage(ball, x[z], y[z]);
            }
        }    
    } else {

        gameOver();
    }        
}

function gameOver() {
    
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'normal bold 18px serif';
    
    ctx.fillText('Game over', C_WIDTH/2, C_HEIGHT/2);
}

function checkApple() {

    if ((x[0] == apple_x) && (y[0] == apple_y)) {

        dots++;
        locateApple();
    }
}

function move() {

    for (var z = dots; z > 0; z--) {
        x[z] = x[(z - 1)];
        y[z] = y[(z - 1)];
    }

    if (leftDirection) {
        x[0] -= DOT_SIZE;
    }

    if (rightDirection) {
        x[0] += DOT_SIZE;
    }

    if (upDirection) {
        y[0] -= DOT_SIZE;
    }

    if (downDirection) {
        y[0] += DOT_SIZE;
    }
}    

function checkCollision() {

    for (var z = dots; z > 0; z--) {

        if ((z > 4) && (x[0] == x[z]) && (y[0] == y[z])) {
            inGame = false;
        }
    }

    if (y[0] >= C_HEIGHT) {
        inGame = false;
    }

    if (y[0] < 0) {
       inGame = false;
    }

    if (x[0] >= C_WIDTH) {
      inGame = false;
    }

    if (x[0] < 0) {
      inGame = false;
    }
}

function locateApple() {

    var r = Math.floor(Math.random() * MAX_RAND);
    apple_x = r * DOT_SIZE;

    r = Math.floor(Math.random() * MAX_RAND);
    apple_y = r * DOT_SIZE;
}    

function gameCycle() {
    
    if (inGame) {

        checkApple();
        checkCollision();
        move();
        doDrawing();
        setTimeout("gameCycle()", DELAY);
    }
}
var pred_class = "Background Noise"
/**
 *   mlcode starts
 */

 // more documentation available at
    // https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/WyffxIWSk/";

    async function createModel() {
        const checkpointURL = URL + "model.json"; // model topology
        const metadataURL = URL + "metadata.json"; // model metadata

        const recognizer = speechCommands.create(
            "BROWSER_FFT", // fourier transform type, not useful to change
            undefined, // speech commands vocabulary feature, not useful for your models
            checkpointURL,
            metadataURL);

        // check that model and metadata are loaded via HTTPS requests.
        await recognizer.ensureModelLoaded();

        return recognizer;
    }

    async function init() {
        canvas = document.getElementById('myCanvas');
        ctx = canvas.getContext('2d');
    
        loadImages();
        createSnake();
        locateApple();
        setTimeout("gameCycle()", DELAY);
       
        const recognizer = await createModel();
        const classLabels = recognizer.wordLabels(); // get class labels
        const labelContainer = document.getElementById("label-container");
        
        for (let i = 0; i < classLabels.length; i++) {
            var new_row=document.createElement("div");
            new_row.className =i;
            
            labelContainer.appendChild(new_row);
        }
        
        // listen() takes two arguments:
        // 1. A callback function that is invoked anytime a word is recognized.
        // 2. A configuration object with adjustable fields
        
        recognizer.listen(result => {
            const scores = result.scores; // probability of prediction for each class
            // render the probability scores per class
            
            let index=scores.indexOf(Math.max(...scores))
            if(index===1)
            {
                downDirection = true;
                rightDirection = false;
                leftDirection = false;
            }
            else if(index===2)
            {
                leftDirection = true;
                upDirection = false;
                downDirection = false;
            }
            else if(index===3)
            {
                rightDirection = true;
                upDirection = false;
                downDirection = false;
            }
            else if(index=== 4)
            {
                upDirection = true;
                rightDirection = false;
                leftDirection = false;
            }
            
            
            labelContainer.childNodes[0].innerHTML=`${classLabels[0]}<div class="w3-light-grey w3-round-xlarge"><div class="w3-container w3-red w3-round-xlarge" style="width:${result.scores[0].toFixed(2)*100}%">${result.scores[0].toFixed(2)*100}</div>`;
            labelContainer.childNodes[1].innerHTML=`${classLabels[1]}<div class="w3-light-grey w3-round-xlarge"><div class="w3-container w3-green w3-round-xlarge" style="width:${result.scores[1].toFixed(2)*100}%">${result.scores[1].toFixed(2)*100}</div>`;
            labelContainer.childNodes[2].innerHTML=`${classLabels[2]}<div class="w3-light-grey w3-round-xlarge"><div class="w3-container w3-orange w3-round-xlarge" style="width:${result.scores[2].toFixed(2)*100}%">${result.scores[2].toFixed(2)*100}</div>`;
            labelContainer.childNodes[3].innerHTML=`${classLabels[3]}<div class="w3-light-grey w3-round-xlarge"><div class="w3-container w3-purple w3-round-xlarge" style="width:${result.scores[3].toFixed(2)*100}%">${result.scores[3].toFixed(2)*100}</div>`;
            labelContainer.childNodes[4].innerHTML=`${classLabels[4]}<div class="w3-light-grey w3-round-xlarge"><div class="w3-container w3-black w3-round-xlarge" style="width:${result.scores[4].toFixed(2)*100}%">${result.scores[4].toFixed(2)*100}</div>`;


        }, {
            includeSpectrogram: true, // in case listen should return result.spectrogram
            probabilityThreshold: 0.75,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
        });
       
        
    }
