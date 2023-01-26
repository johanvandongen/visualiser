export class GraphAlgorithm {
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
    
      get_graph_steps() {
        throw new Error("Method 'get_graph_steps()' must be implemented.");
      }
}
