import { SortingAlgorithm } from "./SortingAlgorithm"

export class BubbleSort extends SortingAlgorithm {
    
    // get_sort_array_steps(values) {
    //     let moves = [];
    //     let temp = structuredClone(values)
    //     for (let i=0; i < (temp.length-1); i++) {
    //         for (let j=i; j >= 0; j--){
                
    //             if (temp[j].val<temp[j+1].val) {
    //                 break;
    //             }

    //             // moves.push({indices: [j,j+1], type: "COMPARE"})

    //             if (temp[j].val>temp[j+1].val) {
    //                 let temp1 = temp[j].val
    //                 temp[j].val = temp[j+1].val
    //                 temp[j+1].val = temp1
    //                 moves.push({values: [...temp], type: "SWAP"})
    //             }
    //         }
    //     }
    //     return moves;
    // }

    get_sort_index_steps(values) {
        console.log("in val: ", values)
        
        let moves = [];
        let temp = structuredClone(values)
        let n = temp.length;
        for (let i = 0; i < n-1; i++) {
            for (let j = 0; j < n-i-1; j++) {
                if (temp[j].val > temp[j+1].val) {
                    let temp1 = temp[j].val
                    temp[j].val = temp[j+1].val
                    temp[j+1].val = temp1
                    moves.push({indices: [j,j+1], type: "SWAP"})
                } 
            }
        }
        console.log(moves)
        return moves
    }
}