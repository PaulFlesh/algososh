import { swap } from "../../utils/utils";

export function selectionSort(array: number[], sorting: 'asc' | 'desc'): number[] {
  for (let i = 0; i < array.length - 1; i++) {
    let index = i;
    for (let j = i; j < array.length - 1; j++) {
      if (sorting === "desc" && array[index] < array[j + 1]) {
        index = j + 1;
      } else if (sorting === "asc" && array[index] > array[j + 1]) {
        index = j + 1;
      }
    }
    swap(array, i, index);
  }
  return array
};

export function bubbleSort(array: number[], sorting: 'asc' | 'desc'): number[] {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (sorting === "desc" && array[j] < array[j + 1]) {
        swap(array, j, j + 1);
      }
      if (sorting === "asc" && array[j] > array[j + 1]) {
        swap(array, j, j + 1);
      }
    }
  }
  return array
};
