import { GraphAlgorithm } from "./GraphAlgorithm"

export class DFS extends GraphAlgorithm {
    
    get_graph_steps(start, end, adjMatrix) {

        if (adjMatrix === null || adjMatrix.length === 0) {
            return []
        }

        let moves = this.DFS(start, end, [], adjMatrix, [])
        console.log("DFS moves", moves)
        return moves
    
        
    }

    DFS(node, end, visited, adjMatrix, moves) {

        visited.push(node)

        moves.push({visited: JSON.stringify(visited), current: node})

        for (const v of this.get_neighbours(node, adjMatrix)) {
            if (!visited.includes(v)) {
                this.DFS(v, end, visited, adjMatrix, moves)
            }
        }
        return moves

    }
}