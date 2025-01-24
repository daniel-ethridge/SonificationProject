// Global object to hold results from the loadTable call
let table;

let bubbles;

// Put any asynchronous data loading in preload to complete before "setup" is run
function preload() {
  table = loadTable('v2_test_mean100_std20.csv', 'header');
}

let sdFactor = 3;



function setup() {
  let p5Canvas = createCanvas(3000, 3000);
  console.log("setup...");

  background(255);

  bubbles = [];

  console.log(table.getRowCount() + ' total rows in table');
  console.log(table.getColumnCount() + ' total columns in table');

  let tableRows = table.getRows();
  console.log("setup...");
  let i=0;
  let x = 0;

  // gene = 100
  // probe = 10
  // sample = 100
  //
  // probe number = 10
  let pn = 10;
  let y = 20;
  for(let g=0; g<table.getRowCount(); g+=pn) {
  //for (let row of tableRows) {
    //let row = table.getRow(r);
    // Get position, diameter, name,

    
    x=10;
    

    for(let s=1; s<table.getColumnCount(); s++) {
     
        for(let p=0; p<pn; p++) {

        

            let v = table.getNum(g+p,s);

            //let y = g+p;

            //let t = map(v,100,300,255,0);
            //stroke(t);
            //line(x,y, x+3,y);
            
            mu = 200;
            std = 28;
            let t = (v - mu) / std;
            // let t = norm(v,172,228);//work out normalised version
            
            if(t>3 || t<-3) {
                fill(255,0,0,204);
                noStroke();
                ellipse(x,y+t/3*10,4,4);
            } else {
              fill(0,51);
              //fill(0,0,0);
                noStroke();
                ellipse(x,y+t/3*10,3,3);
            }
                
        }

        x += 6;
        y = 20 + g + g/pn*20; //+ offset for vertical
        

    }
    //y=g;

    //y+=pn;

    //let id = table.getString(r,0);

    

    
    
    
    //let y = table.getNum(i,1);
    //let s = table.getNum(i,2);
    //let w = table.getNum(i,1);

    // Put object in array
    //bubbles.push(new Bubble(x, y, radius, name));
    //console.log(x,y,s,w);
  }

  //save("bigdata.png");


  describe(
    'When the cursor clicks on the canvas, drags, and releases, a black outline circle representing a bubble appears on the white background. A prompt asks to name the bubble, and this name appears under the circle when the cursor hovers over it.'
  );
}

function draw() {
  //background(255);

  //draw a linear version
  fill(255);
  rect(0,0,width,100);

  let pn = 10;
  let y = 20;

  for(let g=0; g<1; g+=pn) {
  
      
      x=10;
      y = 50;
      
  
      for(let s=1; s<table.getColumnCount(); s++) {
       
          for(let p=0; p<pn; p++) { //for probe
  
          
  
              let v = table.getNum(g+p,s);
              
              mu = 200;
              std = 28;
              let t = (v - mu) / std;
              
              if(t>sdFactor || t<-sdFactor) {
                  noStroke();
                  console.log(t, "no tm");
                  if(t<0) {
                  fill("#00494B");
                  } else {
                    fill("#79260A");
                  }
                  rect(x,y,1,15);
              } else {
                  noStroke();
                  let c1 = color("#FFFFE0");
                  let c2 = color("#BBE4D1");
                  let c3 = color("#FFD593");
                  let mc;
                  if(t>0) {
                    mc = lerpColor(c1,c2,t); // or could be tm instead of t
                  } else {
                    mc = lerpColor(c1,c3,abs(t)); // or could be tm instead of t
                  }
                  fill(mc);
                  rect(x,y,1,15);
              }

              x +=1;
                  
          }
      }
    }

    noLoop();
}
