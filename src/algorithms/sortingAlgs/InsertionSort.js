import { SortingAlgorithm } from "./SortingAlgorithm"

export class InsertionSort extends SortingAlgorithm {

    * stepGenerator(values) {
        let temp = structuredClone(values)
        for (let i=0; i < (temp.length-1); i++) {
            for (let j=i; j >= 0; j--){
                
                if (temp[j].val<temp[j+1].val) {
                    break;
                }

                if (temp[j].val>temp[j+1].val) {
                    let temp1 = temp[j].val
                    temp[j].val = temp[j+1].val
                    temp[j+1].val = temp1
                    yield {array: temp, indices:[j, j+1]}
                }
            }
        }
        
        // Without intermediate swapping
        // let i, key, j
        // for (i=1; i<temp.length; i++) {
        //     key = temp[i].val
        //     j = i - 1;

        //     while (j >= 0 && temp[j].val > key) {
        //         temp[j+1].val = temp[j].val
        //         j = j - 1
        //     }
        //     temp[j+1].val = key
        //     yield {array: temp, indices:[i, j+1]}
        // }
        return;
    }
}