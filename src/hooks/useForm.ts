import React from "react";

interface IUseForm<T> {
  values: T;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  handleChange: (
    event:
      React.MouseEvent<HTMLButtonElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.FormEvent<HTMLInputElement>
  ) => void;
};

export function useForm<T>(inputValues: T): IUseForm<T> {
  const [values, setValues] = React.useState<T>(inputValues);

  const handleChange = (
    event:
      React.MouseEvent<HTMLButtonElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.FormEvent<HTMLInputElement>
  ) => {
    const { value, name } = event.target as HTMLButtonElement | HTMLInputElement;
    setValues({ ...values, [name]: value })
  }
  return { values, setValues, handleChange }
};
