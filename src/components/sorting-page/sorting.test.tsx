import { selectionSort, bubbleSort } from "./utils";

describe("Sorting test", () => {
  it("With an empty array", async () => {
    const initialArr: number[] = [];
    const resultArr = initialArr.sort();
    expect(selectionSort(initialArr, 'desc')).toEqual(initialArr.sort());
    expect(selectionSort(initialArr, 'asc')).toEqual(resultArr);
    expect(bubbleSort(initialArr, 'asc')).toEqual(resultArr);
    expect(bubbleSort(initialArr, 'desc')).toEqual(resultArr.reverse());
  });
  it("With one element array", async () => {
    const initialArr: number[] = [1];
    const resultArr = initialArr.sort();
    expect(selectionSort(initialArr, 'desc')).toEqual(resultArr);
    expect(selectionSort(initialArr, 'asc')).toEqual(resultArr);
    expect(bubbleSort(initialArr, 'asc')).toEqual(resultArr);
    expect(bubbleSort(initialArr, 'desc')).toEqual(resultArr.reverse());
  });
  it("With multiple elements array", async () => {
    const initialArr: number[] = [10, 2, 7, 1];
    const resultArr = initialArr.sort();
    expect(selectionSort(initialArr, 'desc')).toEqual(resultArr);
    expect(selectionSort(initialArr, 'asc')).toEqual(resultArr);
    expect(bubbleSort(initialArr, 'asc')).toEqual(resultArr);
    expect(bubbleSort(initialArr, 'desc')).toEqual(resultArr.reverse());
  });
});
