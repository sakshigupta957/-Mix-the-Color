import {Rectangle, RoundRectangle, Ellipse, Triangle} from "./Shapes.js";

export class DragHandler{
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.dragables = [];
        this.buckets = [];
        this.canvas.addEventListener('mousedown',(md)=>{
            //this.canvas.style.cursor = "grabbing";
            this.dragables.forEach(object => {
                object.isClicked(md.layerX, md.layerY);
            });
        }, false);
        this.canvas.addEventListener('mousemove',(mm)=>{
            this.dragables.forEach(object => {
                //object.hover(this.canvas, mm.layerX, mm.layerY);
                object.drag(mm.layerX, mm.layerY);
            });
        }, false);
        this.canvas.addEventListener( "mouseup", (mu)=>{
            //this.canvas.style.cursor = null;
            this.dragables.forEach(object => {
                object.unclick();
                this.checkForSlot(object);
            });
        }, false);
        this.canvas.addEventListener('touchstart',(ts)=>{
            ts.preventDefault();
            let canBox = this.canvas.getBoundingClientRect();
            let touchX = ts.touches[0].clientX - canBox.left;
            let touchY = ts.touches[0].clientY - canBox.top;
            this.dragables.forEach(object => {
                object.isClicked(touchX, touchY);
            }, false);
        }, false);
        this.canvas.addEventListener('touchmove',(tm)=>{
            tm.preventDefault();
            let canBox = this.canvas.getBoundingClientRect();
            let touchX = tm.touches[0].clientX - canBox.left;
            let touchY =tm.touches[0].clientY - canBox.top;
            this.dragables.forEach(object => {
                object.drag(touchX, touchY);
            });
        }, false);
        this.canvas.addEventListener( "touchend", (te)=>{
            te.preventDefault();
            this.dragables.forEach(object => {
                object.unclick();
                this.checkForSlot(object);
            });
        }, false);
    }
    drawAll(drawColArea){
        [...this.buckets, ...this.dragables].forEach(object =>{
            object.draw(this.ctx, drawColArea);
        });
    }
    checkForSlot(object, idCheck = false){
        let isMatch;
        if(!idCheck) isMatch=true;
        this.buckets.forEach(bucket => {
            if(idCheck){
                if(object.id === bucket.id) isMatch=true;
                else isMatch = false;
            }
            let index = bucket.filledObjectIds.indexOf(object.id);
            if(bucket.isEntered(object.shape.centerX, object.shape.centerY) && isMatch){
                let bestSlot;
                let nearest = 100000;
                bucket.slotCenters.forEach(slot =>{
                    let distance = Math.abs(getDistance(object.shape.centerX, object.shape.centerY, slot[0], slot[1]));
                    if(distance < nearest){
                        bestSlot = slot;
                        nearest = distance;
                    } 
                });
                object.shape.update(bestSlot[0]- object.shape.width*0.5, bestSlot[1] - object.shape.height*0.5);
                if (index == -1) bucket.filledObjectIds.push(object.id);
            }else{
                if (index !== -1) bucket.filledObjectIds.splice(index, 1);
            }
        });
    }
}

export class Dragable{
    constructor(shapeObject, id){
        this.id = id || 0;
        this.shape = shapeObject;
        this.active = false;
        this.initialX = this.shape.x;
        this.initialY = this.shape.y;
        this.offsetX = 0;
        this.offsetY = 0;
        if (this.shape.height < this.shape.width) this.colRadius = this.shape.height * 0.25;
        else this.colRadius = this.shape.width * 0.25;

    }
    isClicked(mouseX, mouseY){
        if (this.shape.isMouseOn(mouseX,mouseY)){
            this.active = true;
            this.offsetX = this.shape.x - mouseX;
            this.offsetY = this.shape.y - mouseY;
        } 
        else{ return false;}
    }
    hover(canvas, mouseX, mouseY){
        if(this.shape.isMouseOn(mouseX, mouseY)){
            canvas.style.cursor = "grab";
        }
    }
    drag(mouseX, mouseY){
        if(this.active) {
            this.shape.update(mouseX + this.offsetX, mouseY + this.offsetY);
            //canvas.style.cursor = "grabbing";
        } 
        else return false;    
    }
    unclick(){
        this.active = false;
        this.offsetX = 0;
        this.offsetY = 0;
    }
    draw(context, drawColArea){
        this.shape.draw(context);
        this.drawCol(context, drawColArea);
    }
    drawCol(context, drawColArea){
        //console.log(this.id);
        if(drawColArea){
            context.save();
            context.globalAlpha = 1;
            context.fillStyle = "#666666";
            context.beginPath();
            context.arc(this.shape.centerX, this.shape.centerY, this.colRadius, 0, Math.PI*2);
            context.fill();
            context.restore();
        }
    }
}

export class Bucket{
    constructor(shapeObject, id, numberOfSlots, direction){
        this.shape = shapeObject;
        this.id = id || 0;
        this.filledObjectIds = [];
        this.numOfSlots = numberOfSlots || 1;
        this.direction = direction || "horizontal";
        this.slotCenters = [];
        for(let i = 1; i <= this.numOfSlots; i++){
            let x, y;
            if(this.direction == "vertical"){
                x = this.shape.centerX;
                y = Math.floor(this.shape.y + (this.shape.height * 1/this.numOfSlots) * i - (this.shape.height * 1/this.numOfSlots)*0.5);   
            }else{
                x = Math.floor(this.shape.x + (this.shape.width * 1/this.numOfSlots) * i - (this.shape.width * 1/this.numOfSlots)*0.5) ; 
                y = this.shape.centerY;
            }
            this.slotCenters.push([x,y]);
        }
    }
    isEntered(checkX, checkY){
        return this.shape.isMouseOn(checkX, checkY);
    }
    draw(context, drawColArea){
        this.shape.draw(context);
        this.drawCol(context, drawColArea);
    }
    drawCol(context, drawColArea){
        if(drawColArea){
            for(let i = 0; i< this.slotCenters.length; i++){
                context.save();
                context.globalAlpha = 1;
                context.fillStyle = "#666666";
                context.beginPath();
                context.arc(this.slotCenters[i][0], this.slotCenters[i][1], 10, 0, Math.PI*2);
                context.fill();
                context.restore();  
            }
        }
    }
};

//==============Drag Utils =================
export function getDistance(x1, y1, x2, y2){
    return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}
