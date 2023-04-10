import { randomValue, shuffleArray, inBound } from './helpers.js'

/**
 * @param {number} w width
 * @param {number} h height
 * @returns adjacency list object, where nodes nearby each other in diamond like graph are connected
 */
export const generateDiamondAdj = (w, h) => {
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
  
  /**
   * Uses generateDiamondAdj(w, h) for adjacency generation and then selects random edges
   * to make graph sparser and add weight/color attributes.
   * @param {{number: number[]}} adj adjacency list
   * @param {boolean} directed whether the graph is directed/undirected
   * @param {number} connectness tbd
   * @returns adjacency list
   */
  export const generateAdjList = (adj, directed, connectness=100) => {
    const STARTCOLOR = "black"
  
    // Select random edges
    if (connectness!==100) {
      for(const node1 in adj) {
          adj[node1] = shuffleArray(adj[node1]).slice(0, randomValue(0, adj[node1].length))
      }
    }
  
    // Make sure adjacency list is correct u: [v, ..] means also v: [u, ..]
    if (!directed) {
      for(const node1 in adj) {
        for (const node2 of adj[node1]) {
          if (!adj[node2].includes(+node1)) {
            adj[node2].push(+node1)
          }
        }
      }
    }
  
    // Add attributes to each edge (weight, color, etc..)
    for (const node1 in adj) {
      adj[node1] = adj[node1].map(val => ({node: val, weight: randomValue(1,10), color: STARTCOLOR}))
    }
  
    return adj
  }
  
  /**
   * @param {number} w number of nodes in a row (alternating between w and w-1)
   * @param {number} h number of rows of full width, so additional of h-1 rows of w-1 width
   * @param {number} margin margin for position of nodes w.r.t graph area boundaries
   * @returns list of nodes
   */
  export const generateNodes = (w, h, margin) => {
    let nodes = [];
    let xStep = (100 - margin*2) / (w-1);
    let yStep = (100 - margin*2) / (h*2-1-1);
    let t = xStep / 2;
    let x = margin;
    let y = margin;
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
      x = toggle === 1 ? margin : margin+t;
      toggle = (toggle+1) % 2;
    }
  
    return nodes
  }