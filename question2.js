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

// how many status = resolved, resolution = fixed 
function query1(defects){ // declarative, 8330
    // filter out the resolved and resolution from defects, returns an array
    const result = defects.filter(defect => defect.status === "RESOLVED" && defect.resolution === "FIXED"); 
    return result.length; 
}

function query2(defects){  // declarative, 2681 
    const result = defects.filter(defect => defect.summary.toLowerCase().includes("buildbot")); 
    return result.length;    
}

function query3(defects){ //declarative, 7.73
    const not_resolved = defects.filter(defect => defect.status != "RESOLVED"); 
    return (not_resolved.length/defects.length) * 100;    
}

function query4(defects){ // GTK + UI
    let count = {}; 
    for (let d of defects) {
        if (count[d.component]) {
            count[d.component]++; 
        } else {
            count[d.component] = 1; 
        }
    }
    
    let max = 0; 
    let component = "";
    let c = 0; 
    for (c in count) {
        if (count[c] > max) {
            max = count[c]; 
            component = c; 
        }
    }
    return component;    
}

function query5(defects){ // jeff.morriss.ws 
    // return array of the ones that apply 
    let total = defects.filter(defect => defect.status === "RESOLVED" && defect.resolution === "FIXED" && defect.component === "Documentation"); 
    let count = {}; 
    for (let d of total) {
        if (count[d.fixed_by_username]) {
            count[d.fixed_by_username]++; 
        } else {
            count[d.fixed_by_username] = 1; 
        }
    } 

    let max = 0; 
    let user = "";
    let c = 0; 
    for (c in count) {
        if (count[c] > max || (count[c] === max && c < user)) { // have a tie break
            max = count[c]; 
            user = c; 
        }
    }
    return user;   
}

function query6(defects){ // false 
    // need a directed graph 
    // example: bug A blocks bug B, bug B blocks bug C, and bug C blocks bug A
    let defectMap = {}; 
    for (let d of defects) {
        defectMap[d.bug_id] = d.blocks; 
    }
    let visited = new Set(); 
    for (let d of defects) {
        let stack = new Set(); 
        let visit = [d.bug_id]; // dfs
        while (visit.length > 0) {
            let curr = visit.pop(); 
            if (stack.has(curr)) { // if in stack, cycle detected 
                return true; 
            } else {
                stack.add(curr); 
                visited.add(curr); 
            }
            if (defectMap[curr]) {
                for (let b of defectMap[curr]) {
                    if (!visited.has(b)) {
                        visit.push(b); 
                    }
                }
            } else {
                stack.delete(curr); 
            }
        }
        return false; 
    }
}

let defects = loadObjects();

console.log(query1(defects));
console.log(query2(defects));
console.log(query3(defects));
console.log(query4(defects));
console.log(query5(defects));
console.log(query6(defects));