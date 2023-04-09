import { COLORS } from "../colors";

export class GraphAlgorithm {

  currentColor = COLORS.color4
  
    constructor() {
        if (this.constructor === GraphAlgorithm) {
          throw new Error("Abstract classes can't be instantiated.");
        }
      }
      
      get_neighbours(node, matrix) {
        let result = []
        for (let i=0; i < matrix[node].length; i++) {
            if (matrix[node][i] !== 0) {
                result.push(i)
            }
        }
        return result
      }

      colorEdge(n1, n2, color, adj) {
        for (const node of adj[n1]) {
          if (node.node === n2) {
            node.color = color;
          }
        }
        for (const node of adj[n2]) {
          if (node.node === n1) {
            node.color = color;
          }
        }
        return adj;
      }
    
      get_graph_steps() {
        throw new Error("Method 'get_graph_steps()' must be implemented.");
      }
}
