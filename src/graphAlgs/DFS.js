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

    stepGenerator(start, end, adjList, nodes) {
        const adjListCopy = structuredClone(adjList)
        const nodesCopy = structuredClone(nodes)
        return this.dfs(start, start, end, [], adjListCopy, nodesCopy)
    }

    * dfs(start, node, end, visited, adj, nodes) {

        visited.push(node)

        yield {adj: adj, nodes: this.color(start, visited, node, nodes)}

        for (const v of adj[node]) {
            if (!visited.includes(v.node)) {
                v.color = "orange"
                
                for (const u of adj[v.node]) {
                    if (u.node === node) {
                        u.color = "orange"
                    }
                }

                yield * this.dfs(start, v.node, end, visited, adj, nodes)
            }
        }
    }

    color(start, visited, current, nodes) {
        for (let i = 0; i < nodes.length; i++) {
            if (i+1 === start){
                nodes[i].color = "green"
            } else if (i+1 === current) {
                nodes[i].color = "orange"
            } else if (visited.includes(i+1) ) {
                nodes[i].color = "gray"
            }
        }
        return nodes
    }
}