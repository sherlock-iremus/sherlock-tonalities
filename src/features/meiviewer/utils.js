export const sameMembers = (selection, otherSelection) => {
  const set = new Set(selection)
  const otherSet = new Set(otherSelection)
  return selection.every(item => otherSet.has(item)) && otherSelection.every(item => set.has(item))
}