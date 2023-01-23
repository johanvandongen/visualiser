
export class BFS {

    get_neighbours(node, matrix) {
        let result = []
        for (let i=0; i < matrix[node].length; i++) {
            if (matrix[node][i] !== 0) {
                result.push(i)
            }
        }
        return result
    }
    
    get_BFS_steps(start, end, adjMatrix) {

        if (adjMatrix === null || adjMatrix.length === 0) {
            return []
        }

        let steps = []
    
        let visited = [start]
        let q = [start]
    
        while (q.length > 0) {
    
            // let node = q[0];
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