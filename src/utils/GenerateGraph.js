import { randomValue, shuffleArray, inBound } from './helpers.js'

// Mutate object instead of new object, is not considered bad practice
// https://stackoverflow.com/questions/28792326/functional-style-javascript-good-practice-to-avoid-argument-mutation

export const generateGraph = (w, h, type) => {
  let nodes;
  let adj;

  switch(type) {
    case 'diamond':
      adj = generateNodes(w, h, 10);
      nodes = generateNodes(w, h);
      break;
    default:
      throw new Error("type of graph must be specified");
  }
  return [nodes, formatAdjList(adj, 80)]
}
  
  /**
   * Formats adjacency list by selecting random edges
   * to make graph sparser and add weight/color attributes.
   * @param {{number: number[]}} adj adjacency list
   * @param {boolean} directed whether the graph is directed/undirected
   * @param {number} connectness tbd
   * @returns adjacency list
   */
  export const formatAdjList = (adj, directed, connectness=100) => {
  
    selectEdges(adj, connectness)
  
    if (!directed) {
      makeSymmetrical(adj)
    }
  
    // Add attributes to each edge (weight, color, etc..)
    for (const node1 in adj) {
      adj[node1] = adj[node1].map(val => ({node: val, weight: randomValue(1,10), color: "black"}))
    }
  
    return adj
  }

  /**
   * Make sure adjacency list is symmetric: u: [v, ..] means also v: [u, ..]
   * 
   * @param {Object.<number, number[]>} adjacencyList 
   * @modifies adjacencyList
   * @returns the symmetric version of an adjacency list
   */
  const makeSymmetrical = (adjacencyList) => {
    for(const node1 in adjacencyList) {
      for (const node2 of adjacencyList[node1]) {
        if (!adjacencyList[node2].includes(+node1)) {
          adjacencyList[node2].push(+node1)
        }
      }
    }
    return adjacencyList
  }

  /**
   * Selects random edges
   * 
   * @param {*} adjacencyList 
   * @param {*} connectness 
   * @modifies adjacencyList
   */
  const selectEdges = (adjacencyList, connectness) => {
    if (connectness!==100) {
      for(const node1 in adjacencyList) {
        adjacencyList[node1] = shuffleArray(adjacencyList[node1]).slice(0, randomValue(0, adjacencyList[node1].length))
      }
    }
    return adjacencyList
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