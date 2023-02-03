import { GraphAlgorithm } from "./GraphAlgorithm"

export class DFS extends GraphAlgorithm {
    
    get_graph_steps(start, end, adjMatrix) {

        if (adjMatrix === null || adjMatrix.length === 0) {
            return []
        }

        let steps = []

        for (const step of this.dfs(start, end, [], adjMatrix, [])) {
            steps.push(step);
        }

        console.log("DFS moves", steps)
        return steps
    
        
    }

    * dfs(node, end, visited, adjMatrix, moves) {

        visited.push(node)

        yield {visited: JSON.stringify(visited), current: node}

        for (const v of this.get_neighbours(node, adjMatrix)) {
            if (!visited.includes(v)) {
                yield * this.dfs(v, end, visited, adjMatrix, moves)
            }
        }
    }
}