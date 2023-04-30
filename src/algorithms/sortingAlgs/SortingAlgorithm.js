export class SortingAlgorithm {
    constructor() {
        if (this.constructor === SortingAlgorithm) {
          throw new Error("Abstract classes can't be instantiated.");
        }
      }
    
      stepGenerator() {
        throw new Error("Method 'stepGenerator()' must be implemented.");
      }
}
