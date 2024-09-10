let visualMode = 2;

let cohortData = []; //0.5 -0.5
let sampleData = []; //3 -3

let vb1, vb2, vb3;

let playhead;

let dir = 1;
let pStart, pEnd;
let pTime;

function setup() {
  createCanvas(800, 400, WEBGL);
  
  // add data
  for(let i=0; i<100; i++) {
    cohortData[i] = Math.random()*1-0.5;
    sampleData[i] = Math.random()*6-3;
  }
  
  vb1 = new VisualBar(cohortData,sampleData, 0, -50);
  
  for(let i=0; i<100; i++) {
    cohortData[i] = Math.random()*1-0.5;
    sampleData[i] = Math.random()*6-3;
  }
  vb2 = new VisualBar(cohortData,sampleData, 0, 0);
  
  for(let i=0; i<100; i++) {
    cohortData[i] = Math.random()*1-0.5;
    sampleData[i] = Math.random()*6-3;
  }
  vb3 = new VisualBar(cohortData,sampleData, 0, 50);
  
  
  // playhead
  playhead = new Playhead();
  
  
}

function draw() {
  background(204);
  fill(153);
  noStroke();
  rect(-width/2,0,width,height/2);
  //
  playhead.render();
  if(!playhead.paused) {
    playhead.play();
    playhead.checkExtent();
  } else {
    pTime++;
  }
  if(playhead.seeking) {
    playhead.seek();
  }
  //
  if(visualMode == 0) {
    
    //render data
    for(let i=0; i<cohortData.length; i++) {
      // cohort
      let cx = width/cohortData.length * i - width/2;
      let cy = cohortData[i]*10;//50 - height/2;
      noStroke();
      fill("grey");
      ellipse(cx,cy,5,5);
      
      // sample
      let sx = width/sampleData.length * i - width/2;
      let sy = sampleData[i]*10;//50 - height/2;
      noStroke();
      fill("royalblue");
      ellipse(sx,sy,5,5);
    }
  }
  
  if(visualMode == 1) {
    for(let i=0; i<sampleData.length; i++) {
      
      // sample
      let cd = cohortData[i];
      let sd = sampleData[i];
      let dd = dist(cd,0,sd,0);
      let sx = width/sampleData.length * i - width/2;
      let sy = 0;
      noStroke();
      let m = dd/3.0 * 255;
      let col = color(0,m,0);
      //fill(col);
      //ellipse(sx,sy,5,5);
      strokeCap(SQUARE);
      strokeWeight(30);
      stroke(col);
      line(sx,sy,sx+width/sampleData.length,sy);
    }
  }
  
  if(visualMode == 2) {
    // test
    vb1.render();
    vb2.render();
    vb3.render();
    
  }
}

function keyPressed() {
  print("key", keyCode)
  if(keyCode == 48) {
    visualMode = 0;
  } else
  if(keyCode == 49) {
    visualMode = 1;
  }
  if(keyCode == 50) {
    visualMode = 2;
  }
}

function mousePressed() {
  print("press");
  playhead.paused = true;
  pStart = mouseX;
  pTime = 0;
  if(mouseY > height/2) {
    print("seek");
    playhead.seeking = true;
  }
}

function mouseReleased() {
  print("release");
  playhead.paused = false;
  pEnd = mouseX;
  let pDist = pEnd - pStart;
  //print(pDist);
  playhead.speed = pDist/pTime;
  if(playhead.seeking) {
    playhead.seeking = false;
  }
}

class Playhead {
  constructor() {
    this.location = 0;
    this.speed = dir;
    this.paused = false;
    this.seeking = false;
  }
  
  play() {
    //print(this.location);
    this.location += this.speed;
  }
  
  seek() {
    this.location = mouseX/width*vb1.cohortData.length-1
    //print(mouseX/width*vb1.cohortData.length-1);
  }
  
  checkExtent() {
    if(this.location > vb1.cohortData.length-1) {
      this.location = 0;
    }
    if(this.location < 0) {
      this.location = vb1.cohortData.length-1;
    }
  }
  
  render() {
    let cd = vb1.cohortData[Math.round(this.location)];
    let sd = vb1.sampleData[Math.round(this.location)];
    let dd = dist(cd,0,sd,0);
    //
    let m = dd/3.0 * 255;
    let mc = color(0,m,0);
    fill(mc);
    noStroke();
    ellipse(-width/2+10,-height/2+10,10,10);
  }
}



class VisualBar {
  constructor(cd, sd, xp, yp) {
    this.cohortData = cd.slice();//arrayCopy(d, dataset);
    this.sampleData = sd.slice();
    this.x = xp;
    this.y = yp;
  }
  
  
  
  render() {
    
    for(let i=0; i<this.sampleData.length; i++) {
      
      // sample
      let cd = this.cohortData[i];
      let sd = this.sampleData[i];
      let dd = dist(cd,0,sd,0);
      let sx = this.x + width/this.sampleData.length * i - width/2;
      let sy = this.y;
      noStroke();
      let m = dd/3.0 * 255;
      let col = color(0,m,0);
      //fill(col);
      //ellipse(sx,sy,5,5);
      strokeCap(SQUARE);
      strokeWeight(30);
      //stroke(col);
      //line(sx,sy,sx+width/this.sampleData.length,sy);
      noStroke();
      if(i == Math.round(playhead.location)) {
        stroke(255,153,0);
        strokeWeight(3);
      }
      fill(col);
      rect(sx,sy,width/this.sampleData.length,30);
    }
    
  }
}