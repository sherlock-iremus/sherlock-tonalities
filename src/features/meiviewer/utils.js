export function sameMembers(arr1, arr2) {
    const set1 = new Set(arr1)
    const set2 = new Set(arr2)
    return arr1.every(item => set2.has(item)) && arr2.every(item => set1.has(item))
}