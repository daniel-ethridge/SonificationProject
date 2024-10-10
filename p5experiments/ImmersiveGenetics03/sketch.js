let visualMode = 2;

let cohortData = []; //0.5 -0.5
let sampleData = []; //3 -3

let vb1, vb2, vb3;

let playhead;

let dir = 1;
let pStart, pEnd;
let pTime;

let world;
let cb1, cb2, cb3;

let cbArr,vbArr;


let pg;

function setup() {
  createCanvas(800, 400, WEBGL);

  pg = createGraphics(200,10);
  for(let i=0; i<200; i+=10) {
    pg.noStroke();
    pg.fill(Math.random()*255,Math.random()*255,Math.random()*255);
    pg.rect(i,0,10,10);
  }

  
  //create other canvas?
  world = new World('ARScene');

  // grab a reference to the marker that we set up on the HTML side (connect to it using its 'id')
  marker = world.getMarker('hiro');

  // - - - 

  buffer1 = createGraphics(256, 256);
  buffer1.background(128,128,128);
  
  // register this texture as a dynamic (updatable) texture
  let texture1 = world.createDynamicTextureFromCreateGraphics(buffer1);

  // create some geometry to add to our marker
  // the marker is 1 meter x 1 meter, with the origin at the center
  // the x-axis runs left and right
  // -0.5, 0, -0.5 is the top left corner
  let basePlane = new Plane({
	  width: 1, height: 1,
	  x: 0, y: 0, z: 0,
	  rotationX: -90,
	  asset: texture1,
	  dynamicTexture: true,
	  dynamicTextureWidth: 256,
	  dynamicTextureHeight: 256
  });
  marker.add(basePlane);

  // - - -
  
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

  cb1 = {'w':300,'h':20,'d':10};
  cb2 = {'w':300,'h':20,'d':10};
  cb3 = {'w':300,'h':20,'d':10};

  cbArr = [cb1,cb2,cb3];
  vbArr = [vb1,vb2,vb3];
  
  
  // playhead
  playhead = new Playhead();

  
  
  
}

function draw() {
  clear();
  // no background needed
  /*background(204);
  fill(153);
  noStroke();
  rect(-width/2,0,width,height/2);*/
  noStroke();
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
    //vb1.render();
    //vb2.render();
    //vb3.render();
    
  }

  orbitControl();
  //rotateY(radians(30));

  //image(tx1,0,0);

  fill(255);
  stroke(0);
  strokeWeight(1);


  // render cubes
  let sp = cbArr[0].w+50;
  translate(-cbArr.length/2*sp - cbArr[0].w/2,0,0);
  for(let i=0; i<cbArr.length; i++) {
    // calculate distribution of cubes
    translate(sp,0,20);
    vbArr[i].putTexture();
    texture(vbArr[i].pg.get());
    box(cbArr[i].w,cbArr[i].h,cbArr[i].d);

    //translate(-i -(cbArr.length/2) * sp,0,-i*20);
    
  }

  

  /*
  translate(0,0,0);
  
  vb1.putTexture();
  
  texture(vb1.pg.get());
  //texture(vb1.pg.get());
  
  box(cb1.w,cb1.h,cb1.d);

  translate(0,0,100);

  vb2.putTexture();
  texture(vb2.pg.get());
  box(cb2.w,cb2.h,cb2.d);

  translate(100,0,50);

  vb3.putTexture();
  texture(vb3.pg.get());
  box(cb3.w,cb3.h,cb3.d);
  */
  
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
    this.pg = createGraphics(width,10);
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
      
      fill(col);
      rect(sx,sy,width/this.sampleData.length,30);

      if(i == Math.round(playhead.location)) {
        stroke(255,153,0);
        noFill()
        strokeWeight(2);
        rect(sx,sy+1,width/this.sampleData.length,30-2);
      }
    }
    
  }

  putTexture() {
    //console.log("put");

    for(let i=0; i<this.sampleData.length; i++) {
      
      // sample
      let cd = this.cohortData[i];
      let sd = this.sampleData[i];
      let dd = dist(cd,0,sd,0);
      let sx = width/this.sampleData.length * i;//this.x + width/this.sampleData.length * i - width/2;
      let sy = 0;//this.y;
      //this.pg.noStroke();
      let m = dd/3.0 * 255;
      let col = color(0,m,0);
      //fill(col);
      //ellipse(sx,sy,5,5);
      //this.pg.strokeCap(SQUARE);
      //this.pg.strokeWeight(30);
      //stroke(col);
      //line(sx,sy,sx+width/this.sampleData.length,sy);
      this.pg.noStroke();
      
      this.pg.fill(col);
      this.pg.rect(sx,sy,width/this.sampleData.length,30);

      if(i == Math.round(playhead.location)) {
        this.pg.stroke(255,153,0);
        this.pg.noFill()
        this.pg.strokeWeight(2);
        this.pg.rect(sx,sy+1,width/this.sampleData.length,30-2);
      }
    }
    
  }
}