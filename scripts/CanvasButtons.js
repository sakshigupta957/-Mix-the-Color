"use strict";
/**@type {HTMLCanvasElement} */
import {Rectangle, RoundRectangle, Ellipse, Triangle} from "./Shapes.js";
import { hexColorShift } from "./colorShift.js";
export class CanvasButtonHandler{
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.buttons = [];
        this.canvas.addEventListener('mousemove',(mm)=>{
            this.buttons.forEach(button => {
                button.hover(this.canvas, mm.layerX, mm.layerY);
            });
        }, false);
    }
    drawAll(){
        [...this.buttons].forEach(object =>{
            object.draw(this.ctx);
        });
    }
}

export class CanvasButton{
    constructor(shapeObject, labelText, textColor, textSize, hoverFill, hoverStroke, pressFill, pressStroke){
        this.shape = shapeObject;
        this.label = labelText;
        this.textColor = textColor || "#191919";
        this.textSize = textSize || Math.round(this.shape.height * 0.50);
        this.hoverFill = hoverFill || "#666666";
        this.hoverStroke = hoverStroke || "#999999"
        this.pressFill = pressFill || "#333333";
        this.pressStroke = pressStroke || "#666666";
        this.orginalFill = this.shape.fillColor;
        this.originalStroke = this.shape.strokeColor;
    }
    hover(canvas, mouseX, mouseY){
        if(this.shape.isMouseOn(mouseX, mouseY)){
            //canvas.style.cursor = "pointer";
            this.shape.fillColor = this.hoverFill;
            this.shape.strokeColor = this.hoverStroke;
        }else{
            this.shape.fillColor = this.orginalFill;
            this.shape.strokeColor = this.originalStroke;
            //canvas.style.cursor = null;
        }
    }
    press(mouseX, mouseY){
        if(this.shape.isMouseOn(mouseX, mouseY)){
            this.shape.fillColor = this.pressFill;
            this.shape.strokeColor = this.pressStroke;
            return true;
        }else{
            this.shape.fillColor = this.orginalFill;
            this.shape.strokeColor = this.originalStroke;
            return false;
        } 
    }
    draw(context){
        context.save();
        this.shape.draw(context);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = `${this.textSize}px Impact`;
        context.fillStyle = this.textColor;
        context.fillText(this.label, this.shape.centerX, this.shape.centerY);
        context.restore();
    }
}
