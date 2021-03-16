/**********************************************************************************
*   This code is based on a program I wrote on Khan Academy.
*   It has been modified to work on your own site.
*   You can see the original at http://www.khanacademy.org/cs/network/1058402007
***********************************************************************************/

// Make sure your code includes this line to setup a 400x400 pixel canvas
void setup() { 
  size(400, 400); 
} 

//Omega Island Code
//use UP, DOWN, LEFT, and Right to move and colect the keys!
//Kol Made This!!!
//var smilyface = "<img src='http://www.khanacademy.org/images/avatars/mr-pants.png' />"; // getImage("avatars/mr-pants");
//var Trash = "<img src='http://www.khanacademy.org/images/avatars/mr-pants.png' />"; // getImage("cute/Key");
var smilyface = loadImage("img/icons/gear.png");
var Trash = loadImage("img/icons/gear.png");
var xpos = 100;
var ypos = 200;
var step = 8;
var trashX = 1;
var trashY = 1;
var trashYend = 40;
var trashXend = 20;
var HeavyMetals = 0;
var SinGas = 0;
var SinGasGain = 1;
var HeavyMetalGain = 1;
background(0, 13, 255);

var draw = function() {
    //if (keyIsPressed && keyCode === RIGHT){
    if (keyIsPressed && keyCode === RIGHT){
        xpos = xpos + step;
    }
    
    if (keyIsPressed && keyCode === DOWN){
        ypos = ypos + step;
    }
    
    if (keyIsPressed && keyCode === UP){
        ypos = ypos - step;
    }
    
    if (keyIsPressed && keyCode === LEFT){
        xpos = xpos - step;
    }
    
    if (xpos > 310) {
        xpos = 309;
    }
    
    if (xpos < -26) {
        xpos = -25;
    }
    
    if (ypos > 275) {
        ypos = 274;
    }
    
    if (ypos < -26) {
        ypos = -25;
    }
    
    if (xpos > trashX && xpos < trashXend && ypos > trashY &&  ypos < trashYend) {
        trashX = random(40,300);
        trashY = random(0,230);
        HeavyMetals = HeavyMetals + HeavyMetalGain;
        SinGas = SinGas + SinGasGain;
    }
    
    //I can't get the MouseIsPressed to work
    if (mouseIsPressed && mouseX > 271 && mouseX < 399 && mouseY > 128 && mouseY < 169 && HeavyMetals > 20) {
        SinGasGain = SinGasGain + 10;
        HeavyMetals = HeavyMetals - 20;
        text("TEXT",100,100);
    }
    
    background(0, 13, 255);
    image(smilyface,xpos,ypos);
    image(Trash,trashX,trashY);
    trashXend = trashX + 50;
    trashYend = trashY + 110;
    fill(255, 255, 255);
    text("HeavyMetals = "+HeavyMetals,2,11);
    text("SinGas = "+SinGas,2,25);
    fill(255, 0, 0);
    rect(271,55,128,41);
    
    fill(17, 74, 112);
    text("SinGas production line",275,75);
    text("HeavyMetal cost = 20",275,90);
};
