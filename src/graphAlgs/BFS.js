import { GraphAlgorithm } from "./GraphAlgorithm"

export class BFS extends GraphAlgorithm {

    * stepGenerator(start, end, adjMatrix) {

        let visited = [start]
        let q = [start]

        while (q.length > 0) {

            let node = q.shift(0)
            yield {visited: JSON.parse(JSON.stringify(visited)), current: node}

            for (const v of this.get_neighbours(node, adjMatrix)) {
                if (!visited.includes(v)) {
                    visited.push(v)
                    q.push(v)
                    yield {visited: JSON.parse(JSON.stringify(visited)), current: node}
                }
            }
        }
    }
    
    get_graph_steps(start, end, adjMatrix) {

        if (adjMatrix === null || adjMatrix.length === 0) {
            return []
        }

        let steps = []
        for (const step of this.bfs(start, end, adjMatrix)) {
            steps.push(step);
        }
        
        return steps
    }
}