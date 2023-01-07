import { SortingAlgorithm } from "./SortingAlgorithm";

export class InPlaceMergeSort extends SortingAlgorithm {

    // Source: https://www.geeksforgeeks.org/in-place-merge-sort/ approach 2

    moves = []
    
    // Calculating next gap
    nextGap(gap) {
        if (gap <= 1){
            return 0;
        }
        return Math.floor(Math.ceil(gap / 2.0));
    }
    
    // Function for swapping
    swap(nums,i,j) {
        console.log("here")
        let temp = nums[i].val;
        nums[i].val = nums[j].val;
        nums[j].val = temp;
        this.moves.push({indices: [i,j], type: "SWAP"})
    }

    // Merging the subarrays using shell sorting
    // Time Complexity: O(nlog n)
    // Space Complexity: O(1)
    inPlaceMerge(nums,start,end) {
        let gap = end - start + 1;
        gap = this.nextGap(gap)
        while (gap > 0) {
            
            for (let i = start; i + gap <= end; i++) {
                let j = i + gap;
                if (nums[i].val > nums[j].val) {
                    this.swap(nums, i, j);
                }
            }
            gap = this.nextGap(gap)
        }
    }

    mergeSort(nums,s,e) {
        if (s === e){
            return;
        }
        
        // Calculating mid to slice the
        // array in two halves
        let mid = Math.floor((s + e) / 2);
    
        // Recursive calls to sort left
        // and right subarrays
        this.mergeSort(nums, s, mid);
        this.mergeSort(nums, mid + 1, e);
        this.inPlaceMerge(nums, s, e);
    }
    
    get_sort_index_steps(values) {
        this.moves = [];
        let temp = structuredClone(values)
        this.mergeSort(temp, 0, temp.length - 1)
        console.log(this.moves)
        return this.moves;
    }
}