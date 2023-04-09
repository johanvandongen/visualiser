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

    found = false;

    stepGenerator(start, end, adjList, nodes) {
        const adjListCopy = structuredClone(adjList)
        const nodesCopy = structuredClone(nodes)
        return this.dfs(start, start, end, [], adjListCopy, nodesCopy)
    }

    * dfs(start, node, end, visited, adj, nodes) {

        visited.push(node)

        yield {adj: adj, nodes: this.color(start, visited, node, nodes)}

        for (const v of adj[node]) {

            if (this.found) {
                return;
            }

            if (v.node === end) {
                this.found = true
                adj = this.colorEdge(v.node, node, "orange", adj);
                yield {adj: adj, nodes: this.color(start, visited, end, nodes)}
                return;
            }

            if (!visited.includes(v.node)) {
                // v.color = "orange"
                adj = this.colorEdge(v.node, node, "orange", adj);
                yield {adj: adj, nodes: this.color(start, visited, node, nodes)}
                
                yield * this.dfs(start, v.node, end, visited, adj, nodes)
                
                // Cool backtrack effect
                // v.color = "gray"
                // for (const u of adj[v.node]) {
                //     if (u.node === node) {
                //         u.color = "gray"
                //     }
                // }
                // yield {adj: adj, nodes: this.color(start, visited, node, nodes)}
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