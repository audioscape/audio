/***********************************************************************************
* Omega Island Code
* Click the canvas, then use UP, DOWN, LEFT, and Right to move and colect the trash!
* Kol Made This!!!
************************************************************************************/

// STEPS TO CONVERT FOR FROM KHAN TO WEB
// 1. include this line to setup a 400x400 pixel canvas
void setup() { 
  size(400, 400); 
} 
// 2. Replace mouseIsPressed with mousePressed. And keyIsPressed with keyPressed.
// 3. Change "var draw = function()" to "void draw()" below.
// 4. Update "background" lines to add 0 value for transparency.

// The next two will aready be done by reusing the 5 lines afterwards...
// 5. Change "getImage" to "loadImage" below.
// 6. Change images to local file paths.

var Avatar = loadImage("img/swarm-bot.png");
var Trash = loadImage("img/agua_64.png");
var Diamond1 = loadImage("../img/icons/gear.png");
var Diamond2 = loadImage("../img/icons/gear.png");
var Diamond3 = loadImage("../img/icons/gear.png");

var BiggerBoatMetalCost = 40;
var BiggerBoatSyngasCost = 25;
var DiggingDeeperCost = 100;
var BiggerBoatMetalCost1 = 40;
var BiggerBoatSyngasCost1 = 25;
var DiggingDeeperCost1 = 100;
var Diamondtype = 0;
var PickDiamond = 0;
var DiamondX = 1;
var DiamondY = 1;
var DiamondXend = 40;
var DiamondYend = 40;
var xpos = 100;
var ypos = 200;
var step = 8;
var trashX = 1;
var trashY = 1;
var trashYend = 40;
var trashXend = 20;
var HeavyMetals = 0;
var SynGas = 0;
var SynGasGain = 0;
var HeavyMetalGain = 1;
var DiamondRandom = 0;
var DiamondLuck = 48;
var UpgradeList = 0;
var DiamondCost = 0;
var Sleep = 0;
var Sleep2 =0;
var AFK = 0;
background(0, 13, 255, 0);

void draw() {
    background(0, 13, 255, 0);
    
    BiggerBoatMetalCost1 = BiggerBoatMetalCost - 1;
    BiggerBoatSyngasCost1 = BiggerBoatSyngasCost - 1;
    DiggingDeeperCost1 = DiggingDeeperCost - 1;
    
    if(AFK === 0) {
            
        if (keyPressed && keyCode === RIGHT){
            xpos = xpos + step;
        }
        
        if (keyPressed && keyCode === DOWN){
            ypos = ypos + step;
        }
        
        if (keyPressed && keyCode === UP){
            ypos = ypos - step;
        }
        
        if (keyPressed && keyCode === LEFT){
            xpos = xpos - step;
        }
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
        trashX = random(40,230);
        trashY = random(0,230);
        HeavyMetals = HeavyMetals + HeavyMetalGain;
        SynGas = SynGas + SynGasGain;
        DiamondRandom = random(0,DiamondLuck);
    }
    
    if (xpos > DiamondX && xpos < DiamondXend && ypos > DiamondY && ypos < DiamondYend && Diamondtype > 0) {
       HeavyMetals = HeavyMetals + HeavyMetalGain;
       SynGas = SynGas + SynGasGain;
       DiamondRandom = 0;
       Diamondtype = 0;
    }
    
    if (DiamondRandom > 48 && PickDiamond < 1) {
        DiamondX = random(40,220);
        DiamondY = random(0,230);
        Diamondtype = 1;
        DiamondRandom = 0;
    }
    
        if (DiamondRandom > 48 && PickDiamond < 2 && PickDiamond > 0.999999999999999999999999999999999999999999) {
        DiamondX = random(40,300);
        DiamondY = random(0,230);
        Diamondtype = 2;
        DiamondRandom = 0;
    }
    
        if (DiamondRandom > 48 && PickDiamond < 3.1 && PickDiamond > 1.999999999999999999999999999999999999999999) {
        DiamondX = random(40,300);
        DiamondY = random(0,230);
        Diamondtype = 3;
        DiamondRandom = 0;
    }
    
    if (Diamondtype === 1) {
        image(Diamond1,DiamondX,DiamondY);
    }
    
        if (Diamondtype === 2) {
        image(Diamond2,DiamondX,DiamondY);
    }
    
        if (Diamondtype === 3) {
        image(Diamond3,DiamondX,DiamondY);
        }
    
    /***
    if (mousePressed && mouseX > 274 && mouseX < 399 && mouseY > 58 && mouseY < 96 && HeavyMetals > 19) {
        SynGasGain = SynGasGain + 1;
        HeavyMetals = HeavyMetals - 20;
    }
    
    if(mousePressed && mouseX > 274 && mouseX < 399 && mouseY > 98 && mouseY < 140 && SynGas > 19) {
        SynGas = SynGas - 20;
        HeavyMetalGain = HeavyMetalGain + 3;
    }
    
    if(mousePressed && mouseX > 274 && mouseX < 399 && mouseY > 141 && mouseY < 186 && HeavyMetals > 39 && SynGas > 24) {
        HeavyMetalGain = HeavyMetalGain + 10;
        SynGasGain = SynGasGain + 10;
        HeavyMetals = HeavyMetals - 40;
        SynGas = SynGas - 25;
    }
    
    if(mousePressed && mouseX > 274 && mouseX < 399 && mouseY > 186 && mouseY < 246 && HeavyMetals > 99 && SynGas > 99) {
        DiamondLuck++;
        HeavyMetals = HeavyMetals - 100;
        SynGas = SynGas - 100;
    }
    
    if(mousePressed && mouseX > 274 && mouseX < 399 && mouseY > 246 && mouseY < 290 && HeavyMetals > 49 && SynGas > 44) {
        step++;
        HeavyMetals = HeavyMetals - 50;
        SynGas = SynGas - 45;
    }
    ***/
    
    if(mousePressed && mouseX > 274 && mouseX < 399 && mouseY > 0 && mouseY < 15 && UpgradeList === 0) {
        UpgradeList = 1;
    }
    
    if( mousePressed && mouseX > 274 && mouseX < 399 && mouseY > 15 && mouseY < 32) {
        UpgradeList = 0;
    }
    
    //UpgradeList
    if(UpgradeList === 1) {
        fill(255, 0, 0);
    rect(271,55,128,41);
    fill(17, 74, 112);
    text("SynGas production line\nHeavyMetal cost = 20",272,75);
    fill(255, 0, 0);
    rect(271,96,128,42);
    fill(17, 74, 112);
    text("HeavyMetal\nProduction Line\nSynGas cost = 20",275,107);
    fill(255, 0, 0);
    rect(271,138,128,46);
    fill(17, 74, 112);
    text("Bigger Boats!!!\nHeavyMetal Cost = "+BiggerBoatMetalCost,275,152);
    text("SynGas Cost = "+BiggerBoatSyngasCost,275,180);
    
    fill(255, 0, 0);
    rect(271,184,128,60);
    fill(17, 74, 112);
    text("Digging Deeper!!!\nHeavyMetal\nCost = "+DiggingDeeperCost,275,199);
    text("SynGas Cost = "+DiggingDeeperCost,275,240);
    
    fill(255, 0, 0);
    rect(271,244,128,44);
    fill(17, 74, 112);
    text("Speed!!!\nHeavyMetal Cost = 50\nSynGasCost = 45",275,257);
    
    fill(255, 0, 0);
    rect(271,288,128,45);
    fill(17, 74, 112);
    text("Slowness!!!\nHeavyMetal Cost = 55\nSynGas Cost = 60",275,300);
    
    fill(255, 0, 0);
    rect(271,333,128,62);
    fill(17,74,112);
    text("AwayFromKeyboard\nfor 5 minutes. Heavy\nMetalCost = 1000\nSynGas Cost = 1000",275,346);
        
           if (mousePressed && mouseX > 274 && mouseX < 399 && mouseY > 58 && mouseY < 96 && HeavyMetals > 19) {
        SynGasGain = SynGasGain + 1;
        HeavyMetals = HeavyMetals - 20;
    }
    
    if(mousePressed && mouseX > 274 && mouseX < 399 && mouseY > 98 && mouseY < 140 && SynGas > 19) {
        SynGas = SynGas - 20;
        HeavyMetalGain = HeavyMetalGain + 1;
    }
    
    if(mousePressed && mouseX > 274 && mouseX < 399 && mouseY > 141 && mouseY < 186 && HeavyMetals > BiggerBoatMetalCost1 && SynGas > BiggerBoatSyngasCost1) {
        HeavyMetalGain = HeavyMetalGain + 10;
        SynGasGain = SynGasGain + 10;
        HeavyMetals = HeavyMetals - BiggerBoatMetalCost;
        SynGas = SynGas - BiggerBoatSyngasCost;
        BiggerBoatMetalCost = BiggerBoatMetalCost + 15;
        BiggerBoatSyngasCost = BiggerBoatSyngasCost + 15;
    }
    
    if(mousePressed && mouseX > 274 && mouseX < 399 && mouseY > 186 && mouseY < 246 && HeavyMetals > DiggingDeeperCost1 && SynGas > DiggingDeeperCost1) {
        DiamondLuck++;
        DiamondCost = DiamondCost + 10;
        HeavyMetals = HeavyMetals - DiggingDeeperCost;
        SynGas = SynGas - DiggingDeeperCost;
        DiggingDeeperCost = DiggingDeeperCost + 20;
    }
    
    if(mousePressed && mouseX > 274 && mouseX < 399 && mouseY > 246 && mouseY < 290 && HeavyMetals > 49 && SynGas > 44) {
        step++;
        HeavyMetals = HeavyMetals - 50;
        SynGas = SynGas - 45;
    }
    
    if(mousePressed && mouseX > 274 && mouseX < 399 && mouseY > 290 && mouseY < 334 && SynGas > 54 && HeavyMetals > 59) {
        HeavyMetals = HeavyMetals - 60;
        SynGas = SynGas - 55;
        step--;
        
        if(mousePressed && mouseX > 274 && mouseX < 399 && mouseY > 334 && mouseY < 397 && HeavyMetals > 999 && SynGas > 999) {
            HeavyMetals = HeavyMetals - 1000;
            SynGas = SynGas - 1000;
            AFK = 1;
            Sleep2 = 0;
            }
        
        }
        
    }
    
    if(AFK === 1) {
        Sleep = Sleep + 1;
    }
    
    if(Sleep === 500) {
        Sleep2 = Sleep2 + 1;
        HeavyMetals = HeavyMetals + HeavyMetalGain;
        SynGas = SynGas + SynGasGain;
    }
    
    if(Sleep2 === 15) {
        Sleep = 0;
        AFK = 0;
        Sleep2 = 0;
    }
    
    PickDiamond = random(0,3);
    image(Avatar,xpos,ypos);
    image(Trash,trashX,trashY);
    trashXend = trashX + 50;
    trashYend = trashY + 110;
    DiamondXend = DiamondX + 100;
    DiamondYend = DiamondY + 100;
    fill(255, 255, 255);
    text("HeavyMetals = "+HeavyMetals,2,11);
    text("SynGas = "+SynGas,2,25);
 /***   
    fill(255, 0, 0);
    rect(271,55,128,41);
    fill(17, 74, 112);
    text("SinGas production line\nHeavyMetal cost = 20",275,75);
    fill(255, 0, 0);
    rect(271,96,128,42);
    fill(17, 74, 112);
    text("HeavyMetal\nProduction Line\nSinGas cost = 20",275,107);
    fill(255, 0, 0);
    rect(271,138,128,46);
    fill(17, 74, 112);
    text("Bigger Boats!!!\nHeavyMetal Cost = 40\nSinGas Cost = 25",275,152);
    
    fill(255, 0, 0);
    rect(271,184,128,60);
    fill(17, 74, 112);
    text("Diamonds!!!\nHeavyMetal\nCost = 100\nSinGas Cost = 100",275,199);
    
    fill(255, 0, 0);
    rect(271,244,128,44);
    fill(17, 74, 112);
    text("Speed!!!\nHeavyMetal Cost = 50\nSinGasCost = 45",275,257);
    
    fill(255, 0, 0);
    rect(271,288,128,45);
    fill(17, 74, 112);
    text("Slowness!!!\nHeavyMetal Cost = 60\nSinGas Cost = 55",275,300);
    ***/
    fill(255, 0, 0);
    rect(271,0,128,15);
    fill(17, 74, 112);
    text("Show Upgrades!!!",275,12);
    
    fill(255, 0, 0);
    rect(271,15,128,15);
    fill(17, 74, 112);
    text("Hide Upgrades!!!",275,27);
    
    fill(255, 0, 0);
    //text("X = "+mouseX,100,100);
    //text("Y = "+mouseY,100,120);
};
