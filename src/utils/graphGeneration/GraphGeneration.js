import { shuffleArray, randomValue } from "../helpers";

export class GraphGeneration {
  margin = 10; // margin for position of nodes w.r.t graph area boundaries

  constructor() {
      if (this.constructor === GraphGeneration) {
        throw new Error("Abstract classes can't be instantiated.");
      }
  }
    
    /**
   * Formats adjacency list by selecting random edges
   * to make graph sparser and add weight/color attributes.
   * @param {{number: number[]}} adj adjacency list
   * @param {boolean} directed whether the graph is directed/undirected
   * @param {number} connectness tbd
   * @returns adjacency list
   */
  static formatAdjList = (adj, directed, connectness=100) => {
  
    this.selectEdges(adj, connectness)
  
    if (!directed) {
      this.makeSymmetrical(adj)
    }
  
    // Add attributes to each edge (weight, color, etc..)
    for (const node1 in adj) {
      adj[node1] = adj[node1].map(val => ({node: val, weight: randomValue(1,10), color: "black"}))
    }
  
    return adj
  }

  // Mutate object instead of new object, is not considered bad practice
  // https://stackoverflow.com/questions/28792326/functional-style-javascript-good-practice-to-avoid-argument-mutation

  /**
   * Selects random edges
   * @param {*} adjacencyList 
   * @param {*} connectness 
   * @modifies adjacencyList
   */
  static selectEdges = (adjacencyList, connectness) => {
    if (connectness!==100) {
      for(const node1 in adjacencyList) {
        adjacencyList[node1] = shuffleArray(adjacencyList[node1]).slice(0, randomValue(0, adjacencyList[node1].length))
      }
    }
    return adjacencyList
  }

  /**
   * Make sure adjacency list is symmetric: u: [v, ..] means also v: [u, ..]
   * 
   * @param {Object.<number, number[]>} adjacencyList 
   * @modifies adjacencyList
   * @returns the symmetric version of an adjacency list
   */
  static makeSymmetrical = (adjacencyList) => {
    for(const node1 in adjacencyList) {
      for (const node2 of adjacencyList[node1]) {
        if (!adjacencyList[node2].includes(+node1)) {
          adjacencyList[node2].push(+node1)
        }
      }
    }
    return adjacencyList
  }

  
    
  generateNodes() {
    throw new Error("Method 'generateNodes()' must be implemented.");
  }

  generateAdjacencyList() {
    throw new Error("Method 'generateAdjacencyList' must be implemented.");
  }
}