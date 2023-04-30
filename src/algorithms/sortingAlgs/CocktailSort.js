import { SortingAlgorithm } from "./SortingAlgorithm";

export class CocktailSort extends SortingAlgorithm {

    * stepGenerator(values) {
        let temp = structuredClone(values)

        const n = temp.length
        let swapped = true
        let start = 0
        let end = n-1

        while (swapped) {
            swapped = false
            for (let i = start; i < end; i++) {
                if (temp[i].val > temp[i+1].val) {
                    let tempVal = temp[i].val
                    temp[i].val = temp[i+1].val
                    temp[i+1].val = tempVal 
                    swapped = true
                }
                yield {array: temp, indices:[i, i+1]}
            }

            if (!swapped) {
                break;
            }

            swapped = false
            end = end - 1

            for (let i = end - 1; i > start-1; i--) {
                if (temp[i].val > temp[i+1].val) {
                    let tempVal = temp[i].val
                    temp[i].val = temp[i+1].val
                    temp[i+1].val = tempVal 
                    swapped = true
                }
                yield {array: temp, indices:[i, i+1]}
            }

            start = start + 1
        }
    }
}