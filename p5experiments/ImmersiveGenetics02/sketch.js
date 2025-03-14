let visualMode = 1;

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

let buffer1, buffer2, buffer3;
let geneSound1, geneSound2, geneSound3;

let c1;// = color("#FFFFE0");
let c2;// = color("#BBE4D1");
let c3;// = color("#FFD593");
let sdFactor = 3;

// Global object to hold results from the loadTable call
let table;

// Put any asynchronous data loading in preload to complete before "setup" is run
function preload() {
  table = loadTable('data/v2_test_mean100_std20.csv', 'header');
  console.log("table loaded");
}

function setup() {
  createCanvas(800, 400);

  c1 = color("#FFFFE0");
  c2 = color("#BBE4D1");
  c3 = color("#FFD593");

  pg = createGraphics(200,10);
  for(let i=0; i<200; i+=10) {
    pg.noStroke();
    pg.fill(Math.random()*255,Math.random()*255,Math.random()*255);
    pg.rect(i,0,10,10);
  }

  //create data
  let tableGene1 = [];
  let pn = 10;
  for(let g=0; g<1; g+=pn) {
    for(let s=1; s<table.getColumnCount(); s++) {  
      for(let p=0; p<pn; p++) { //for probe
        let v = table.getNum(g+p,s);
        console.log("v", v);
        tableGene1.push(v);
      }
    }
  }

  
  //create other canvas?
  world = new World('ARScene');

  // grab a reference to the marker that we set up on the HTML side (connect to it using its 'id')
  marker = world.getMarker('hiro');

  // - - - 

  buffer1 = createGraphics(256, 256);
  buffer1.background(128,128,128);

  // register this texture as a dynamic (updatable) texture
  let testTexture = world.createDynamicTextureFromCreateGraphics(buffer1);

  // create some geometry to add to our marker
  // the marker is 1 meter x 1 meter, with the origin at the center
  // the x-axis runs left and right
  // -0.5, 0, -0.5 is the top left corner
  let basePlane = new Plane({
	  width: 1, height: 1,
	  x: 0, y: 0, z: 0,
	  rotationX: -90,
	  asset: testTexture,
	  dynamicTexture: true,
	  dynamicTextureWidth: 256,
	  dynamicTextureHeight: 256
  });
  marker.add(basePlane);

  // - - -

  for(let i=0; i<100; i++) {
    cohortData[i] = Math.random() * 10;
    sampleData[i] = Math.random() * 10;
  }
  
  vb1 = new VisualBar2(tableGene1, 0, 0);
  
  for(let i=0; i<100; i++) {
    cohortData[i] = Math.random() * 20;
    sampleData[i] = Math.random() * 20;
  }
  vb2 = new VisualBar(cohortData,sampleData, 0, 0);
  
  for(let i=0; i<100; i++) {
    cohortData[i] = Math.random() * 100;
    sampleData[i] = Math.random() * 100;
  }

  vb3 = new VisualBar(cohortData,sampleData, 0, 50);

  cb1 = {'w':1000,'h':20,'d':10};
  cb2 = {'w':300,'h':20,'d':10};
  cb3 = {'w':300,'h':20,'d':10};

  cbArr = [cb1];//[cb1,cb2,cb3];
  vbArr = [vb1];//[vb1,vb2,vb3];
  
  // playhead
  playhead = new Playhead();

  // - - -

  buffer2 = createGraphics(200,30);
  buffer2.background(0);

  for(let i=0; i<200; i+=10) {
    buffer2.noStroke();
    buffer2.fill(Math.random()*255,Math.random()*255,Math.random()*255);
    buffer2.rect(i,0,10,30);
  }

  // register this texture as a dynamic (updatable) texture
  let texture1 = world.createDynamicTextureFromCreateGraphics(vb1.pg);
  let texture2 = world.createDynamicTextureFromCreateGraphics(vb2.pg);
  let texture3 = world.createDynamicTextureFromCreateGraphics(vb3.pg);

  let fc1 = new Box({
	  width: 3, height: 0.3, depth: 0.2,
	  x: 0, y: 1, z: 0,
	  asset: texture1,
	  dynamicTexture: true,
	  dynamicTextureWidth: 256,
	  dynamicTextureHeight: 256
  });

  let fc2 = new Box({
	  width: 2, height: 0.3, depth: 0.2,
	  x: 0, y: 1, z: 0,
	  asset: texture2,
	  dynamicTexture: true,
	  dynamicTextureWidth: 256,
	  dynamicTextureHeight: 256
  });

  let fc3 = new Box({
	  width: 2, height: 0.3, depth: 0.2,
	  x: 3, y: 1, z: 0,
	  asset: texture3,
	  dynamicTexture: true,
	  dynamicTextureWidth: 256,
	  dynamicTextureHeight: 256
  });

  marker.add(fc1);
  //marker.add(fc2);
  //marker.add(fc3);

  const startButton = createButton("Start Audio");
  startButton.position(10, 320);
  startButton.style("z-index: 1000");

  // Stop audio button
  const stopButton = createButton("Stop Audio");
  stopButton.position(10, 350);
  stopButton.style("z-index: 1000");
  
  geneSound1 = new GeneSound(-1);
  geneSound2 = new GeneSound(0);
  geneSound3 = new GeneSound(1);

  startButton.mousePressed(() => {
    geneSound1.startOscillator();
    geneSound2.startOscillator();
    geneSound3.startOscillator();
  })

  stopButton.mousePressed(() => {
    geneSound1.stopOscillator();
    geneSound2.stopOscillator();
    geneSound3.stopOscillator();
  })
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
    pTime += deltaTime;
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
    // vb3.render();
    // for(let i=0; i<sampleData.length; i++) {
      
    //   // sample
    //   let cd = cohortData[i];231
    //   let sd = sampleData[i];
    //   let dd = dist(cd,0,sd,0);
    //   let sx = width/sampleData.length * i - width/2;
    //   let sy = 0;
    //   noStroke();
    //   let m = dd/3.0 * 255;
    //   let col = color(0,m,0);
    //   //fill(col);
    //   //ellipse(sx,sy,5,5);
    //   strokeCap(SQUARE);
    //   strokeWeight(30);
    //   stroke(col);
    //   line(sx,sy,sx+width/sampleData.length,sy);
    // }
  }

  let indexVal = Math.round(playhead.location);

  if (vb1.colorData[indexVal] != undefined) {
    let colorValue = 0;// vb1.colorData[indexVal]["levels"][1]; //important!

    geneSound1.playSound(colorValue);
  }

  if (vb2.colorData[indexVal] != undefined) {
    let colorValue = vb2.colorData[indexVal]["levels"][1];

    geneSound2.playSound(colorValue);
  }

  if (vb3.colorData[indexVal] != undefined) {
    let colorValue = vb3.colorData[indexVal]["levels"][1];

    geneSound3.playSound(colorValue);
  }

  
  
  if(visualMode == 2) {
    // test
    //vb1.render();
    //vb2.render();
    //vb3.render();
    
  }

  //orbitControl();
  //rotateY(radians(30));

  //image(tx1,0,0);

  /*
  fill(255);
  stroke(0);
  strokeWeight(1);
  */


  // render cubes
  //let sp = cbArr[0].w+50;
  //translate(-cbArr.length/2*sp - cbArr[0].w/2,0,0);
  for(let i=0; i<cbArr.length; i++) {
    // calculate distribution of cubes
    //translate(sp,0,20);
    vbArr[i].putTexture(i);
    //texture(vbArr[i].pg.get());
    //box(cbArr[i].w,cbArr[i].h,cbArr[i].d);

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

// muting this function so you can't switch modes, this is only AR.
/*
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
*/

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
    this.location = (mouseX / width * vb1.sampleData.length) - 1
    //print(mouseX/width*vb1.cohortData.length-1);
  }
  
  checkExtent() {
    if(this.location > vb1.sampleData.length-1) {
      this.location = 0;
    }
    if(this.location < 0) {
      this.location = vb1.sampleData.length-1;
    }
  }
  
  render() {
    /*let cd = vb1.sampleData[Math.round(this.location)];
    let sd = vb1.sampleData[Math.round(this.location)];
    let dd = dist(cd,0,sd,0);
    //
    let m = dd/3.0 * 255;
    let mc = color(0,m,0);
    fill(mc);
    noStroke();
    ellipse(-width/2+10,-height/2+10,10,10);
    */
  }
}



class VisualBar {
  constructor(cd, sd, xp, yp) {
    this.cohortData = cd.slice();//arrayCopy(d, dataset);
    this.sampleData = sd.slice();
    this.x = xp;
    this.y = yp;
    this.pg = createGraphics(width,10);

    // this.offset = 
  
    this.colorData = Array();
  }
  
  render() {
    console.log("RENDER CALLED");
    this.colorData = Array();
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
      this.colorData.push(col);
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

  putTexture(arr_idx) {
    //console.log("put");
    this.colorData = Array();

    for(let i=0; i<this.sampleData.length; i++) {
      
      // sample
      let cd = this.cohortData[i];
      let sd = this.sampleData[i];
      let dd = dist(cd,0,sd,0);
      let sx = width/this.sampleData.length * i;//this.x + width/this.sampleData.length * i - width/2;
      let sy = 0;//this.y;
      //this.pg.noStroke();

      let m;
      if (arr_idx == 0) {
        m = (dd + 122 - 77) * (255 / 100);
      } else if (arr_idx == 1) {
        m = (dd + 117 - 77) * (255 / 100);
      } else {
        m = dd * (255 / 100);
      }
      let col = color(0,m,0);
      this.colorData.push(col);

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

class VisualBar2 {
  constructor(data, xp, yp) {
    //this.cohortData = data.slice();//arrayCopy(d, dataset);
    this.sampleData = data.slice();
    this.x = xp;
    this.y = yp;
    this.width = 1000;
    this.pg = createGraphics(this.width,10);

    // this.offset = 
  
    this.colorData = Array();
  }
  
  render() {
    console.log("RENDER CALLED");
    this.colorData = Array();
    for(let i=0; i<this.sampleData.length; i++) {
      
      // sample
      let sd = this.sampleData[i];
      //let cd = this.cohortData[i];
      //let dd = dist(cd,0,sd,0);
      let sx = this.x + this.width/this.sampleData.length * i - this.width/2;
      let sy = this.y;
      //noStroke();
      //let m = dd/3.0 * 255;
      //let col = color(0,m,0);
      //this.colorData.push(col);
      //fill(col);
      //ellipse(sx,sy,5,5);
      //strokeCap(SQUARE);
      //strokeWeight(30);
      //stroke(col);
      //line(sx,sy,sx+width/this.sampleData.length,sy);
      //noStroke();
      
      //fill(col);
      //rect(sx,sy,width/this.sampleData.length,30);

      // draw playhead
      if(i == Math.round(playhead.location)) {
        stroke(255,153,0);
        noFill()
        strokeWeight(2);
        rect(sx,sy+1,this.width/this.sampleData.length,30-2);
      }
    }
    
  }

  putTexture(arr_idx) {
    //console.log("put");
    this.colorData = Array();

    let x=0;
    let y=0;

    for(let i=0; i<this.sampleData.length; i++) {
      
      // sample
      //let cd = this.sampleData[i];
      //let sd = this.sampleData[i];
      //let dd = dist(cd,0,sd,0);
      let sx = this.width/this.sampleData.length * i;//this.x + width/this.sampleData.length * i - width/2;
      let sy = 0;//this.y;
      //this.pg.noStroke();

      let v = this.sampleData[i];

      let mu = 200;
      let std = 28;
      let z = (v - mu) / std;
      //console.log("v", v, "t", t);

      /*let m;
      if (arr_idx == 0) {
        m = (dd + 122 - 77) * (255 / 100);
      } else if (arr_idx == 1) {
        m = (dd + 117 - 77) * (255 / 100);
      } else {
        m = dd * (255 / 100);
      }
      let col = color(0,m,0);*/

      // important!
      this.colorData.push(z); // use to be col
      // important!

      //fill(col);
      //ellipse(sx,sy,5,5);
      //this.pg.strokeCap(SQUARE);
      //this.pg.strokeWeight(30);
      //stroke(col);
      //line(sx,sy,sx+width/this.sampleData.length,sy);
      this.pg.noStroke();

      if(z>sdFactor || z<-sdFactor) {
        
        //console.log(t, "no tm");
        if(z<0) {
          this.pg.fill("#00494B");
        } else {
          this.pg.fill("#79260A");
        }
        this.pg.rect(sx,y,1,15);
      } else {
        noStroke();
        let c1 = color("#FFFFE0");
        let c2 = color("#76C7BE");
        let c3 = color("#F5AD52");
        let mc;
        if(z>0) {
          mc = lerpColor(c1,c2,z); // or could be tm instead of t
        } else {
          mc = lerpColor(c1,c3,abs(z)); // or could be tm instead of t
        }
        this.pg.fill(mc);
        //this.pg.fill(255,0,255);
        this.pg.rect(sx,y,1,15);
      }
      x++;

      //
      //this.pg.noStroke();
      
      //this.pg.fill(col);
      //this.pg.rect(sx,sy,this.width/this.sampleData.length,30);

      if(i == Math.round(playhead.location)) {
        //console.log("playhead match", i);
        this.pg.stroke(0);
        this.pg.noFill();
        this.pg.strokeWeight(3);
        this.pg.rect(sx,sy+1,this.width/this.sampleData.length,30-2);
      }
    }
  }
}
