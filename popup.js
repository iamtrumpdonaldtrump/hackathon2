document.addEventListener('DOMContentLoaded', function() {

/*const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const leftborder = 5;
const rightborder = leftborder;
const upborder = leftborder;
const bottomborder = leftborder;
const widthborders = leftborder + rightborder;
const heightborders = upborder + bottomborder;

const stageWidth = 180 - widthborders;    // pomniejszone o sumę grubości prawej i lewej krawędzi
const stageHeight = 150 - heightborders; // pomniejszone o sumę grubości górnej i dolnej krawędzi

const dx = 1;
const dy = 5;

canvas.width = stageWidth;     
canvas.height = stageHeight;

let rafhandle;
let rafhandle2;
let min = 1;
let max = 5;
let vector = false;

class Ball  {
  constructor(){
    this.name = 'Ball';
  }

  ball = {
    x: (stageWidth/2)-Math.floor((Math.random()*10)+5),
    y: (stageHeight/2)-Math.floor((Math.random()*10)+5),
    vx: dx,
    vy: dy,
    radius: 5,
    diameter: this.radius * 2,
    color: "orangered",
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      //ctx.fillRect(this.x,this.y,this.radius*2,this.radius*2);
      ctx.closePath();
      
      ctx.fill();
    }
  }
 
};

let balls = [];

for(let i = 0; i < 15; i++){

  balls[i] = new Ball();
   
}


let boundries = {
    up:0,
    right:stageWidth,
    bottom:stageHeight,
    left:0
};


function draw() {

  ctx.clearRect(0, 0, stageWidth, stageHeight);
  //ctx.fillStyle = "rgb(255 255 255 / 30%)";
  //ctx.fillRect(0, 0, stageWidth, stageHeight);

  balls.forEach((el,ind,arr) => {

    el.ball.draw();

    /*if(vector){
      el.ball.vx = Math.floor((Math.random()*max)+min) * -1
      el.ball.x += el.ball.vx;
      el.ball.vy = Math.floor((Math.random()*max)+min);
      el.ball.y -= el.ball.vy;
     // el.ball.vy *= 0.99;
      //el.ball.vy += 0.25;
    /*  vector!=vector;
    }else{*/

    /* tu odkomentuj
      el.ball.x -= el.ball.vx;
      el.ball.y += el.ball.vy;
      el.ball.vy *= 0.99;
      el.ball.vy += 0.25;
      //vector!=vector;
    //}
    if(el.ball.x <= boundries.left + el.ball.radius){
      el.ball.vx = Math.floor((Math.random()*max)+min) * -1;
      el.ball.color = 'blue';
    }
    if(el.ball.x >= boundries.right - el.ball.radius){
      el.ball.vx = Math.floor((Math.random()*max)+min) ;
      el.ball.color = 'red';
    }
    if(el.ball.y <= boundries.up + el.ball.radius){
      el.ball.vy = Math.floor((Math.random()*max)+min);
      el.ball.color = 'green';
    }
    if(el.ball.y >= boundries.bottom - el.ball.radius){
      el.ball.vy = (Math.floor((Math.random()*max)+min) * -1);
      el.ball.color = 'blueviolet';
    }
    
    arr.forEach((nel,nind) => {
      if(ind !== nind){
        if(Math.min(el.ball.x + el.ball.radius,el.ball.x + el.ball.radius - el.ball.vx) >= Math.min(nel.ball.x - nel.ball.radius,nel.ball.x - nel.ball.radius + nel.ball.vx)
          && Math.min(el.ball.x - el.ball.radius,el.ball.x - el.ball.radius + el.ball.vx) <= Math.min(nel.ball.x + nel.ball.radius,nel.ball.x + nel.ball.radius - nel.ball.vx)
          && Math.min(el.ball.y + el.ball.radius,el.ball.y + el.ball.radius - el.ball.vy) >= Math.min(nel.ball.y - nel.ball.radius,nel.ball.y - nel.ball.radius + nel.ball.vy)
          && Math.min(el.ball.y - el.ball.radius,el.ball.y - el.ball.radius + el.ball.vy) <= Math.min(nel.ball.y + nel.ball.radius,nel.ball.y + nel.ball.radius - nel.ball.vy)
          ){

            el.ball.color = 'orangered';
            nel.ball.color = 'grey';

            let ballvx = el.ball.vx;
            let ballvy = el.ball.vy;
            let ball2vx = nel.ball.vx;
            let ball2vy = nel.ball.vy;
          
            if(ballvx > 0 && ball2vx > 0 || ballvx < 0 && ball2vx < 0) {
          
              
                if(ballvx >= ball2vx){
                  ballvx *= -2;
                }else{
                  ball2vx *= -2;
                }
             
              
             
            }  
          
            if(ballvy > 0 && ball2vy > 0 || ballvy < 0 && ball2vy < 0){
          
              if(ballvy >= ball2vy){
                ballvy *= -2;
              }else{
                ball2vy *= -2;
              }
          
            }
          

            if(ballvx+ball2vx == 0){
              ballvx *= -2;
            }
            if(ballvy+ball2vy == 0){              
              ball2vy *= -2;
            }
          
          
            el.ball.vx = ball2vx;
            el.ball.vy = ball2vy;
            nel.ball.vx = ballvx;
            nel.ball.vy = ballvy;
        }
    
      }
     })
    
});
 
  rafhandle = window.requestAnimationFrame(draw);
}




/*window.addEventListener("click", (e) => {
  window.cancelAnimationFrame(rafhandle);
});

window.addEventListener("dblclick", (e) => {
    window.requestAnimationFrame(draw);
  });*/



//draw();

  var analyzeButton = document.getElementById('analyzeButton');

  analyzeButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { command: "analyze" });
    });
  });

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.command === "displayResult") {
      var resultDiv = document.getElementById('result');
      if (message.toxic) {
        resultDiv.innerHTML = "<p>This text is toxic!</p>";
        resultDiv.style.color = 'red';
      } else {
        resultDiv.innerHTML = "<p>This text is not toxic.</p>";
        resultDiv.style.color = 'green';
      }
    }
  });

});
