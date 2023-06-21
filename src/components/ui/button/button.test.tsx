import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Button render", () => {
  it("Button render with text", () => {
      render(<Button text={"Some text"} />);
      expect(screen.getByRole("button")).toMatchSnapshot();
  });

  it("Button render without text", () => {
      render(<Button />);
      expect(screen.getByRole("button")).toMatchSnapshot();
  });

  it("Disabled button render", () => {
      render(<Button disabled={true} />);
      expect(screen.getByRole("button")).toMatchSnapshot();
  });

  it("Loading button render", () => {
      render(<Button isLoader={true} />);
      expect(screen.getByRole("button")).toMatchSnapshot();
  });

  it("Button render with callback", () => {
      const func = jest.fn();
      render(<Button onClick={func} />);
      fireEvent.click(screen.getByRole("button"));
      expect(func).toHaveBeenCalled();
  });
});
