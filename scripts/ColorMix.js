"use strict";
/**@type {HTMLCanvasElement} */
import {RoundRectangle, Ellipse} from "./Shapes.js";
import {DragHandler, Dragable, Bucket} from "./Dragables.js";
import { CanvasButtonHandler, CanvasButton } from "./CanvasButtons.js";

export class ColorMix{
    constructor(canvas){
        this.canvas = canvas;
        this.dragHandler = new DragHandler(this.canvas);
        this.matchShape = new RoundRectangle(250, 450, 75, 75, 15, "#333", 1, 3, "white");
        this.color1Bucket = new Bucket(new RoundRectangle(25, 450, 75, 75, 10), "color1");
        this.color2Bucket = new Bucket(new RoundRectangle(135, 450, 75, 75, 10), "color2");
        this.buttonHandler = new CanvasButtonHandler(this.canvas);
        this.mainButton = new CanvasButton(new RoundRectangle(125, 600, 100, 35, 10, "#00ff00", 1, 2, "#ffffff", 1), 
        "Check Color", "#191919", 15, "#009900", "white", "#006600", "white");
        this.instructionsButton = new CanvasButton(new RoundRectangle(275, 600, 35, 35, 5, "#ff0000", 1, 2, "#ffffff", 1), "?", "#ffffff", 20, "#990000");
        this.gameOverlay = document.getElementById("gameOverlay");
        this.startButton = document.getElementById("startButton");
        this.tryAgainButton = document.getElementById("tryAgain");
        this.score=0;
        this.strikes=0;
        this.instructionsOpen = true;
        this.mouseOn = false;


        //===== Event Listeners for Buttons
        this.canvas.addEventListener('mousedown',(md)=>{
            if(this.mainButton.press(md.layerX, md.layerY)) this.#isColorMixCorrect();
            if(this.instructionsButton.press(md.layerX, md.layerY)) this.#toggleInstructions();
        }, false);
        this.canvas.addEventListener('touchstart',(ts)=>{
            ts.preventDefault();
            let canBox = this.canvas.getBoundingClientRect();
            let touchX = ts.touches[0].clientX - canBox.left;
            let touchY = ts.touches[0].clientY - canBox.top;
            if(this.mainButton.press(touchX, touchY)) this.#isColorMixCorrect();
            if(this.instructionsButton.press(touchX, touchY)) this.#toggleInstructions();
         }, false);
        this.startButton.addEventListener("click", (c)=>{
            this.#startGame();
        });
        this.tryAgainButton.addEventListener("click",(c)=>{
            this.#restartGame();
        });

    }
    load(){
        //dragables
        const redDrag = new Dragable(new RoundRectangle(75, 100, 75, 75, 10, "#ff0000"),"red" );
        const greenDrag = new Dragable(new RoundRectangle(75, 200, 75, 75, 10, "#00ff00"), "green");
        const blueDrag = new Dragable(new RoundRectangle(75, 300, 75, 75, 10, "#0000ff"), "blue");
        const magDrag = new Dragable(new Ellipse(200, 100, 75, 75, "#ff00ff"), "magenta");
        const yellowDrag = new Dragable(new Ellipse(200, 200, 75, 75, "#ffff00"), "yellow");
        const cyanDrag = new Dragable(new Ellipse(200, 300, 75, 75, "#00ffff"), "cyan");
        this.dragHandler.dragables.push(redDrag, greenDrag, blueDrag, magDrag, yellowDrag, cyanDrag); 

        //buckets
        this.dragHandler.buckets.push(this.color1Bucket, this.color2Bucket);

        //canvas buttons
        this.buttonHandler.buttons.push(this.mainButton, this.instructionsButton);
    }
    runGame(drawColArea){
        if (this.strikes >= 3) this.#drawEnd("lose");
        else if (this.score >= 200) this.#drawEnd("win");
        else this.#drawGame();
    }
    #drawGame(drawColArea){
        let ctx = this.dragHandler.ctx;

        //text
        ctx.save();
        ctx.font = "20px Impact";
        ctx.fillStyle = "white";
        ctx.fillText(`Score | ${this.score}`, 50, 575);
        ctx.fillText(`${this.strikes} | Strikes`, 225, 575);
        ctx.font = "40px Impact";
        ctx.fillText("+", 107, 500);
        ctx.fillText("=", 218, 500);
        ctx.font = "50px Impact";
        ctx.fillText("Mix the Color", 45, 60);
        ctx.restore();

        //matchShape
         this.matchShape.draw(ctx);
         this.dragHandler.drawAll(drawColArea);
         this.buttonHandler.drawAll(); 
    }
    #drawEnd(state){
        this.gameOverlay.style.width = "100%";
        this.gameOverlay.style.left = null;
        this.gameOverlay.style.opacity = null;
        document.getElementById("mixColorRules").style.display = "none";
        document.getElementById("endScreen").style.display = "flex";
        if(state == "win"){
            document.getElementById("endMessage").innerHTML = "You Win!";
            this.gameOverlay.style.backgroundColor = "#00ff00";
            document.body.style.backgroundImage = "linear-gradient(-45deg, #ff0000, #ffff00, #00ff00,#00ffff, #0000ff, #ff00ff)"
        } 
    }
    #generateRandomColor(){
        let randomColorIndex = Math.floor(Math.random() * 5.5);
        this.matchShape.id = COLOR_DICT[randomColorIndex].name; 
        this.matchShape.fillColor = COLOR_DICT[randomColorIndex].hexcode;
    }
    #startGame(){
        this.#toggleInstructions();
        this.startButton.innerHTML = "Continue Mixing";
        this.#generateRandomColor();
    }
    #restartGame(){
        this.score = 0;
        this.strikes = 0;
        document.getElementById("endScreen").style.display = null;
        document.getElementById("mixColorRules").style.display = null;
        this.startButton.style.display = null;
        this.startButton.innerHTML = "Start Color Mixing";
        document.getElementById("endMessage").innerHTML = "Game Over";
        this.gameOverlay.style.width = null;
        this.gameOverlay.style.backgroundColor = null;
        this.gameOverlay.style.opacity = null;
        document.body.style.backgroundImage = null;
        this.instructionsOpen = true;
    }
    #toggleInstructions(){
        if(this.instructionsOpen){
            this.gameOverlay.style.left = "-315px";
            this.startButton.style.display = "none";
            this.gameOverlay.style.opacity = "0";
            this.instructionsOpen = false;

        }else{
            this.gameOverlay.style.left = "0px";
            this.startButton.style.display = null;
            this.gameOverlay.style.opacity = null;
            this.instructionsOpen = true;

        }

    }
    #isColorMixCorrect(){
        let colorToMatch = this.matchShape.id;
        let color1 = this.color1Bucket.filledObjectIds[0];
        let color2 = this.color2Bucket.filledObjectIds[0];
        let mixColors;
        for (let i = 0; i < 6; i++){
            if(COLOR_DICT[i].name == colorToMatch) mixColors = COLOR_DICT[i].mixColors;
        }
        if((color1 == mixColors[0] && color2 == mixColors[1]) ||
        (color2 == mixColors[0] && color1 == mixColors[1])){
            this.score += 10;
            this.#generateRandomColor();
        } else { 
            this.strikes += 1;
        };
        this.#resetShapes() 
    }
    #resetShapes(){
        this.dragHandler.dragables.forEach(object => {
            object.shape.update(object.initialX, object.initialY);
        });
    }
}
export const COLOR_DICT ={
    0: {
        name: "red",
        hexcode: "#FF0000",
        mixColors: ["magenta", "yellow"],
        complement: "cyan"
    },
    1: {
        name: "green",
        hexcode: "#00FF00",
        mixColors: ["yellow", "cyan"],
        complement: "magenta"
    },
    2: {
        name: "blue",
        hexcode: "#0000FF",
        mixColors: ["cyan", "magenta"],
        complement: "yellow"
    },
    3: {name: "magenta",
        hexcode: "#FF00FF", 
        mixColors: ["red", "blue"],
        complement: "green"
    },
    4: {
        name: "yellow",
        hexcode: "#FFFF00",
        mixColors: ["red", "green"],
        complement: "blue"
    },
    5: {
        name: "cyan",
        hexcode: "#00FFFF",
        mixColors: ["green", "blue"],
        complement: "red"
    }
}
