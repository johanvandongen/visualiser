import { GraphAlgorithm } from "./GraphAlgorithm"

export class BFS extends GraphAlgorithm {
    
    get_graph_steps(start, end, adjMatrix) {

        if (adjMatrix === null || adjMatrix.length === 0) {
            return []
        }

        let steps = []
    
        let visited = [start]
        let q = [start]
    
        while (q.length > 0) {
    
            let node = q.shift(0)
            steps.push({visited: JSON.parse(JSON.stringify(visited)), current: node})
    
            for (const v of this.get_neighbours(node, adjMatrix)) {
                if (!visited.includes(v)) {
                    visited.push(v)
                    q.push(v)
                    steps.push({visited: JSON.parse(JSON.stringify(visited)), current: node})
                }
            }
        }
        console.log("BFS moves", steps)
        return steps
    }
}