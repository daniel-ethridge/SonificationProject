// Global object to hold results from the loadTable call
let table;

let bubbles;

// Put any asynchronous data loading in preload to complete before "setup" is run
function preload() {
  table = loadTable('test_mean100_std20.csv', 'header');
}



function setup() {
  let p5Canvas = createCanvas(600, 1000);
  console.log("setup...");

  bubbles = [];

  console.log(table.getRowCount() + ' total rows in table');
  console.log(table.getColumnCount() + ' total columns in table');

  let tableRows = table.getRows();
  console.log("setup...");
  let i=0;
  let x = 0;
  for(let r=0; r<table.getRowCount(); r++) {
  //for (let row of tableRows) {
    //let row = table.getRow(r);
    // Get position, diameter, name,

    let id = table.getString(r,0);

    x=0;

    for(let c=1; c<table.getColumnCount(); c++) {
    
    let y = r;
    let v = table.getNum(r,c);
    let t = map(v,100,300,255,0);
    stroke(t);
    line(x,y, x+6,y);
    x += 6;
    //let y = table.getNum(i,1);
    //let s = table.getNum(i,2);
    //let w = table.getNum(i,1);

    // Put object in array
    //bubbles.push(new Bubble(x, y, radius, name));
    //console.log(x,y,s,w);
    }
  }


  describe(
    'When the cursor clicks on the canvas, drags, and releases, a black outline circle representing a bubble appears on the white background. A prompt asks to name the bubble, and this name appears under the circle when the cursor hovers over it.'
  );
}

function draw() {
  //background(255);

  
}
