// Isabel Ojeda
// HW 2 Q2

// Q2.1
class Defect {
    constructor(bug_id, component, status, resolution, summary, blocks, depends, fixed_by_username, fixed_by_real_name) {
        this.bug_id = Number(bug_id);
        this.component = component; 
        this.status = status; 
        this.resolution = resolution; 
        this.summary = summary;
        this.blocks = []; // defined as an array 
        this.depends = []; // defined as an array
        this.fixed_by_username = fixed_by_username;
        this.fixed_by_real_name = fixed_by_real_name || null; // some developers have an empty real_name
    }
}

function parseCsv(data) {
    return data.split("\n").map(row => row.split(",")); 
}

function loadObjects(){
    /* ... Your implementation here ... */
    // You can use the readFile from the fs module
    // See the documentation: https://nodejs.org/en/knowledge/file-system/how-to-read-files-in-nodejs/
    // The CSV files are comma-separated

    const fs = require('fs');               // module for file I/O
    const readline = require("readline");   // module for reading line-by-line from file
    
    // create input streams
    let defectsCSV = fs.readFileSync("defects.csv","utf8");        
    let dependsCSV = fs.readFileSync("defect_depends.csv","utf8");
    let blocksCSV = fs.readFileSync("defect_blocks.csv","utf8");
    let developersCSV = fs.readFileSync("developers.csv","utf8");

    const developers = {}; 
    const developersInfo = parseCsv(developersCSV); 
    developersInfo.forEach(row => {
        const [real_name, username] = row; 
        if (username) {
            developers[username] = real_name || null;
        } 
        }); 

    const defects = {}; 
    const defectsInfo = parseCsv(defectsCSV); 
    defectsInfo.forEach(row => {
        // skip to index 13 for name 
        const [bug_id, component, status, resolution, summary, , , , , , , , , fixed_by] = row; 
        const defect = new Defect(bug_id, component, status, resolution, summary, [], [], fixed_by, developers[fixed_by]); 
        defects[bug_id] = defect; 
    }); 
            
    const dependsInfo = parseCsv(dependsCSV); 
    dependsInfo.forEach(row => {
    const [from_defect_id, to_defect_id] = row; 
    if (defects[from_defect_id]) {
        defects[from_defect_id].depends.push(Number(to_defect_id));        
        }
    }); 
            
    const blocksInfo = parseCsv(blocksCSV); 
    blocksInfo.forEach(row => {
    const [from_defect_id, to_defect_id] = row; 
    if (defects[from_defect_id]) {
        defects[from_defect_id].blocks.push(Number(to_defect_id));  
        } 
    }); 
    
    return Object.values(defects);
}

function query1(defects){
    /* Your implementation here */
    return /*...*/;    
}

function query2(defects){
    /* Your implementation here */
    return /*...*/;    
}

function query3(defects){
    /* Your implementation here */
    return /*...*/;    
}

function query4(defects){
    /* Your implementation here */
    return /*...*/;    
}

function query5(defects){
    /* Your implementation here */
    return /*...*/;    
}

function query6(defects){
    /* Your implementation here */
    return /*...*/;    
}


let defects = loadObjects();

query1(defects);
query2(defects);
query3(defects);
query4(defects);
query5(defects);
query6(defects);