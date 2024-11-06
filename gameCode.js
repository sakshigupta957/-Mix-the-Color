//"use strict";
/**@type {HTMLCanvasElement} */
let drawColArea = false;
import {ColorMix} from "./scripts/ColorMix.js";

window.onload = init;

function init(){
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    //game init
    const game = new ColorMix(canvas);
    game.load();

//========================================================
    function gameLoop(timeStamp) {
        //clear canvas
        ctx.clearRect(0,0,canvas.width,canvas.height);

        //draw dragables
        game.runGame(drawColArea);

        requestAnimationFrame(gameLoop);
    }

