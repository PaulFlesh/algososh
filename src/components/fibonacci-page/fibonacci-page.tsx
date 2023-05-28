import React from "react";
import { nanoid } from "nanoid";
import styles from './fibonacci-page.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { useForm } from "../../hooks/useForm";
import { timeout } from "../../utils/utils";

export const FibonacciPage: React.FC = () => {
  const [loader, setLoader] = React.useState(false);
  const [resultArray, setResultArray] = React.useState<{ items: Array<number> }>({ items: [] });
  const { values, setValues, handleChange } = useForm<{ number: number | null }>({ number: null });

  const fibonacci = (number: number): number[] => {
    let arr: number[] = [1, 1];
    for (let i = 2; i < number + 1; i++) {
      arr.push(arr[i - 1] + arr[i - 2])
    }
    return arr
  };

  async function renderItems(number: number) {
    let arr = fibonacci(number);
    let resultArr: number[] = [];
    for (let i = 0; i < arr.length; i++) {
      resultArr.push(arr[i]);
      await timeout(SHORT_DELAY_IN_MS);
      setResultArray({ items: resultArr });
    }
    setLoader(false);
  };

  const onClick = () => {
    setLoader(true);
    setValues({ number: null });
    setResultArray({ items: [] });
    renderItems(Number(values.number));
  };

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <div className={styles.container}>
        <div className={styles.input}>
          <Input
            name="number"
            isLimitText={true}
            maxLength={2}
            min={1}
            max={19}
            type='number'
            value={values.number || ""}
            onChange={(e) => handleChange(e)}
          />
          <Button
            text={'Рассчитать'}
            onClick={onClick}
            isLoader={loader}
            disabled={!values.number
              || !Number(values.number)
              || values.number > 19 
              || values.number < 1}
          />
        </div>
        {resultArray && (
          <div className={styles.result}>
            {resultArray.items.map((item, index) => {
              return (
                <Circle
                  index={index}
                  key={nanoid()}
                  letter={item.toString()}
                />
              );
            })}
          </div>
        )}
      </div>
    </SolutionLayout>
  );
};
