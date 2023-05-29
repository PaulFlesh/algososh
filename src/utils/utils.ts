import { ElementStates } from "../types/element-states";

export const swap = (arr: Array<any>, firstIndex: number, secondIndex: number): Array<any> => {
  const temp = arr[firstIndex];
  arr[firstIndex] = arr[secondIndex];
  arr[secondIndex] = temp;
  return arr;
};

export async function timeout(timeout: number) {
  return new Promise(res => setTimeout(() => res(true), timeout))
};

export const setCircleState = (item: any) => {
  return item.changing
    ? ElementStates.Changing
    : item.modified
    ? ElementStates.Modified
    : ElementStates.Default;
};

export function isEmpty(str: string): boolean {
  if (str.trim() === '') return true;
  return false;
};
