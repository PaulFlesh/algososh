import { swapString } from "./utils";

describe("Recursion test", () => {
  it("With an even number of characters", async () => {
    const initialText = ['a','b','c','d'];
    const resultText = initialText.reverse();
    expect(swapString(initialText)).toBe(resultText);
  });
  it("With an odd number of characters", async () => {
    const initialText = ['a','b','c'];
    const resultText = initialText.reverse();
    expect(swapString(initialText)).toBe(resultText);
  });
  it("With one character", async () => {
    const initialText = ['a'];
    const resultText = initialText.reverse();
    expect(swapString(initialText)).toBe(resultText);
  });
  it("With an empty string", async () => {
    const initialText = [''];
    const resultText = initialText.reverse();
    expect(swapString(initialText)).toBe(resultText);
  });
});
