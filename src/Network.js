export class Network {

    constructor(directed = false) {
        this.nodes = []
        this.adjList = new Map()
        this.directed = directed;
    }

    addVertex(v) {
        if (typeof v === "number" || typeof v === "string") {
            this.nodes.push(v)
            this.adjList.set(v, [])
        } else {
            throw Error("vertex must be either a number or a string")
        }
        
    }

    addEdge(v, w, weight=1, color="black") {
        if (!this.adjList.has(v)) {
            this.adjList.set(v, [])
        }

        if (!this.adjList.has(w)) {
            this.adjList.set(w, [])
        }

        this.adjList.get(v).push({node: w, weight: weight, color: color})
        this.adjList.get(w).push({node: v, weight: weight, color: color})

    }

}
