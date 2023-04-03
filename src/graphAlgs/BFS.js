import { GraphAlgorithm } from "./GraphAlgorithm"

export class BFS extends GraphAlgorithm {

    * stepGenerator(start, end, adjList, nodes) {
        let adjListCopy = structuredClone(adjList)
        const nodesCopy = structuredClone(nodes)

        let visited = [start]
        let q = [start]

        while (q.length > 0) {

            let node = q.shift(0)
            yield {adj: adjListCopy, nodes: this.color(start, visited, q, node, nodesCopy)}

            for (const v of adjListCopy[node]) {

                if (!visited.includes(v.node)) {
                    
                    // v.color = "orange"
                    adjListCopy = this.colorEdge(v.node, node, "orange", adjListCopy)
                    yield {adj: adjListCopy, nodes: this.color(start, visited, q, node, nodesCopy)}

                    visited.push(v.node)
                    q.push(v.node)
                    yield {adj: adjListCopy, nodes: this.color(start, visited, q, node, nodesCopy)}

                    // Change color to gray after edge is used
                    adjListCopy = this.colorEdge(v.node, node, "gray", adjListCopy)
                    // v.color = "gray"
                    yield {adj: adjListCopy, nodes: this.color(start, visited, q, node, nodesCopy)}
                }

                
            }
        }
    }
    
    color(start, visited, queue, current, nodes) {
        for (let i = 0; i < nodes.length; i++) {
            if (i+1 === start){
                nodes[i].color = "green"
            } else if (i+1 === current) {
                nodes[i].color = "orange"
            } else if (visited.includes(i+1) && !queue.includes(i+1)) {
                nodes[i].color = "gray"
            } else if (queue.includes(i+1)) {
                nodes[i].color = "black"
            }
        }
        return nodes
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