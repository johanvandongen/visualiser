import { DiamondGraph } from './DiamondGraph.js';
import { GraphGeneration } from './GraphGeneration.js';

/**
 * 
 * @param {String} type type of graph that should be generated ('diamond',  ...)
 * @param {Boolean} directed whether the graph is directed or undirected
 * @param {number} connectness chances of an edge appearing
 * @param  {...any} arg arguments for specifying how the the type of graph should be generated
 * @returns 
 */
export const GraphFactory = (type, directed, connectness, ...arg) => {
  let nodes;
  let adj;

  switch(type) {
    case 'diamond':
      const diamondGraph = new DiamondGraph()
      adj = diamondGraph.generateAdjacencyList(...arg);
      nodes = diamondGraph.generateNodes(...arg);
      break;
    default:
      throw new Error("type of graph must be specified");
  }
  return [nodes, GraphGeneration.formatAdjList(adj, directed, connectness)]
}