import { SortingAlgorithm } from "./SortingAlgorithm";

export class QuickSort extends SortingAlgorithm {


    partition(values, low, high) {
        const pivot = values[high].val // Can be random
        let i = low - 1

        for (let j=low; j<high; j++) {
            if (values[j].val <= pivot) {
                i += 1

                let temp = values[i].val
                values[i].val = values[j].val
                values[j].val = temp;
            }
        }
        let temp = values[i+1].val
        values[i+1].val = values[high].val
        values[high].val = temp;

        return i + 1
    }

    * quickSort(values, low, high) {
        
        yield {array: values, indices: [low, high]}

        if (low < high) {
            let pi = this.partition(values, low, high)
            yield * this.quickSort(values, low, pi - 1)
            yield * this.quickSort(values, pi + 1, high)
        }
    }

    * stepGenerator(values) {
        let temp = structuredClone(values)
        yield * this.quickSort(temp, 0, temp.length - 1)
    }
}