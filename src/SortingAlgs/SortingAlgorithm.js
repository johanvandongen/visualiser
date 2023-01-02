export class SortingAlgorithm {
    constructor() {
        if (this.constructor === SortingAlgorithm) {
          throw new Error("Abstract classes can't be instantiated.");
        }
      }
    
      get_sort_array_steps() {
        throw new Error("Method 'get_sort_array_steps()' must be implemented.");
      }
}
