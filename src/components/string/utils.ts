import { swap } from "../../utils/utils";

export function swapString(arr: string[]): string[] {
  let start = 0;
  let end = arr.length - 1;
  while (start < end) {
    swap(arr, start, end);
    start++;
    end--;
  }
  return arr
};
