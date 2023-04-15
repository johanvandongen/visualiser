import { GraphGeneration } from "./GraphGeneration";
import { inBound } from "../helpers";

// Generates a diamond like network graph with node positions and information about edges.
export class DiamondGraph extends GraphGeneration {

    validateInput(w, h) {
        const invalidType = typeof w !== "number" || typeof h !== "number"
        const invalidWidth = w < 2 || w > 10
        const invalidHeight = w < 2 || w > 10

        if (invalidType || invalidWidth || invalidHeight) {
            throw Error(
                `width and height should be a number between 2 and 10, 
                got width = ${w}, height = ${h}`
            )
        }
    }
    
    /**
     * @param {number} w number of nodes in a row (alternating between w and w-1)
     * @param {number} h number of rows of full width, so additional of h-1 rows of w-1 width
     * @returns list of nodes
     */
    generateNodes(w, h) {
        this.validateInput(w, h)
        let nodes = [];
        let xStep = (100 - this.margin*2) / (w-1);
        let yStep = (100 - this.margin*2) / (h*2-1-1);
        let t = xStep / 2;
        let x = this.margin;
        let y = this.margin;
        let toggle = 0;
        let count = 0;
    
        // Creates nodes in diamond like pattern
        for (let row=0; row<h*2-1; row++) {
        for(let col=0; col<w-toggle; col++) {
            nodes.push({x:x, y:y, color:"white", id:'node'+count})
            x += xStep
            count += 1
        }
        y += yStep
        x = toggle === 1 ? this.margin : this.margin+t;
        toggle = (toggle+1) % 2;
        }
    
        return nodes
    }

    /**
     * @param {number} w width
     * @param {number} h height
     * @returns adjacency list object, where nodes nearby each other in diamond like graph are connected
     */
    generateAdjacencyList(w, h) {
        this.validateInput(w, h)
        let nrOfNodes = w*h + (w-1)*(h-1);
        let adj = {}
        let toggle = 0;
        let count = 1

        for (let row=0; row<h*2-1; row++) {
            for(let col=0; col<w-toggle; col++) {

            if (col===0 && toggle===0) { // Left col
                adj[count] = inBound([count-((w-1)*2+1), count-w+1, count+w, count+(w-1)*2+1], 1, nrOfNodes)
            } else if (col===w-toggle-1 && toggle===0) { // Right col
                adj[count] = inBound([count-((w-1)*2+1), count+w-1, count-w, count+(w-1)*2+1], 1, nrOfNodes)
            } else if (row===0 || row===h*2-1-1) { // top and bottom row
                if (!adj.hasOwnProperty(count)) {
                adj[count] = inBound([count-1, count+1], 1, nrOfNodes)
                } else {
                adj[count].push(...inBound([count-1, count+1], 1, nrOfNodes))
                }
            } else {
                adj[count] = inBound([count-w, count-w+1, count+w, count+w-1, count+w+(w-1), count-(w+(w-1))], 1, nrOfNodes)
            }

            count += 1
            }
            toggle = (toggle+1) % 2;
        }
        return adj

    }
}