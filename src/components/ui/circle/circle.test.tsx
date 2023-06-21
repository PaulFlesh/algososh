import { render } from "@testing-library/react";
import { Circle } from "./circle";

describe("Circle render", () => {
  it("Circle render with text prop", () => {
    expect(render(<Circle letter={"abcd"} />)).toMatchSnapshot();
  });

  it("Circle render without text prop", () => {
    expect(render(<Circle />)).toMatchSnapshot();
  });

  it("Circle render with head prop", () => {
    expect(render(<Circle head={"head"} />)).toMatchSnapshot();
  });

  it("Circle render with react head prop", () => {
    expect(render(<Circle head={<div></div>} />)).toMatchSnapshot();
  });

  it("Circle render with tail prop", () => {
    expect(render(<Circle tail={"tail"} />)).toMatchSnapshot();
  });

  it("Circle render with react tail prop", () => {
    expect(render(<Circle tail={<div></div>} />)).toMatchSnapshot();
  });

  it("Circle render with index prop", () => {
    expect(render(<Circle index={0} />)).toMatchSnapshot();
  });
});
