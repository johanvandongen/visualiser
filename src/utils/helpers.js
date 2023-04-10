export const arraysAreEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i=0; i<arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

/**
 * 
 * @param min minimum value that is included
 * @param max maximum value that is included
 * @returns random value between min and max
 */
export const randomValue = (min, max) => {
    return Math.floor(Math.random()*(max-min+1)+min)
  }

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

/**
 * 
 * @param l arr
 * @param s start bound included
 * @param e end bound included
 * @returns 
 */
export function inBound(l, s, e) {
    let newArr = []
    for (const val of l) {
        if (s <= val && val <= e) {
            newArr.push(val)
        }
    }
    return newArr
}