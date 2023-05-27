import React from "react";

interface IUseForm<T> {
  values: T;
  handleChange: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.FormEvent<HTMLInputElement>
  ) => void;
  setValues: React.Dispatch<React.SetStateAction<T>>;
};

export function useForm<T>(inputValues: T): IUseForm<T> {
  const [values, setValues] = React.useState<T>(inputValues);
  
  const handleChange = (event: any): void => {
    const {value, name} = event.target;
    setValues({...values, [name]: value})
  }
return { values, setValues, handleChange }
};
