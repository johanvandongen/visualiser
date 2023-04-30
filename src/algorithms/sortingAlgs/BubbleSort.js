import { SortingAlgorithm } from "./SortingAlgorithm"

export class BubbleSort extends SortingAlgorithm {

    * stepGenerator(values) {
        let temp = structuredClone(values)
        let n = temp.length;


        for (let i = 0; i < n-1; i++) {
            for (let j = 0; j < n-i-1; j++) {
                if (temp[j].val > temp[j+1].val) {
                    let temp1 = temp[j].val
                    temp[j].val = temp[j+1].val
                    temp[j+1].val = temp1
                    yield {array: temp, indices:[j, j+1]}
                } 
            }
        }
    }
}