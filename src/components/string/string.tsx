import React from "react";
import { nanoid } from "nanoid";
import styles from './string.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { DELAY_IN_MS } from "../../constants/delays";
import { useForm } from "../../hooks/useForm";
import { swap, timeout, setCircleState } from "../../utils/utils";
import { IResultObj } from "../../types/result";

export const StringComponent: React.FC = () => {
  const [loader, setLoader] = React.useState(false);
  const [resultArray, setResultArray] = React.useState<{ items: Array<IResultObj> }>({ items: [] });
  const { values, setValues, handleChange } = useForm<{ text: string | null }>({ text: null });

  const setItemState = (arr: Array<IResultObj>, firstIndex: number, secondIndex: number) => {
    if (firstIndex >= 1 && secondIndex < arr.length) {
      arr[firstIndex - 1].changing = false;
      arr[firstIndex - 1].modified = true;
      if (arr[secondIndex + 1]) {
        arr[secondIndex + 1].changing = false;
        arr[secondIndex + 1].modified = true;
      }
    }
    arr[firstIndex].changing = true;
    arr[secondIndex].changing = true;
    return arr
  };

  const modifyArray = (
    arr: Array<IResultObj>,
    start: number,
    end: number,
    prevState: boolean
  ) => {
    if (prevState) {
      if (arr.length % 2) {
        arr[start - 1].modified = true;
        arr[start].modified = true;
        arr[end + 1].modified = true;
        arr[start - 1].changing = false;
        arr[end + 1].changing = false;
      } else {
        arr[start].modified = true;
        arr[end].modified = true;
        arr[start].changing = false;
        arr[end].changing = false;
      }
      return arr;
    } else {
      return setItemState(arr, start, end);
    }
  };

  async function swapString([...str]: Array<IResultObj>) {
    let start = 0;
    let end = str.length - 1;
    while (start < end) {
      let modifiedArray = modifyArray(str, start, end, false);
      await timeout(DELAY_IN_MS);
      setResultArray({ items: modifiedArray });
      let changedArray = swap(modifiedArray, start, end);
      await timeout(DELAY_IN_MS);
      setResultArray({ items: changedArray });
      start++;
      end--;
      if (start >= end) {
        modifiedArray = modifyArray(str, start, end, true);
        await timeout(DELAY_IN_MS);
        setResultArray({ items: modifiedArray });
      }
    }
  };

  const onClick = () => {
    setValues({ text: null });
    setLoader(true);
    let result: Array<IResultObj> = [];
    if (values.text) {
      result = values.text.split("").map(value => {
        return { value, modified: false, changing: false };
      })
    }
    setResultArray({ ...resultArray, items: result });
    swapString(result);
    setLoader(false);
  };

  return (
    <SolutionLayout title="Строка">
      <div className={styles.container}>
        <div className={styles.input}>
          <Input
            name="text"
            isLimitText={true}
            maxLength={11}
            value={values.text || ""}
            onChange={(e) => handleChange(e)}
          />
          <Button
            text={'Развернуть'}
            onClick={onClick}
            isLoader={loader}
            disabled={!values.text}
          />
        </div>
        {resultArray && (
          <div className={styles.result}>
            {resultArray.items.map(item => {
              return (
                <Circle
                  state={setCircleState(item)}
                  key={nanoid()}
                  letter={item.value}
                />
              );
            })}
          </div>
        )}
      </div>
    </SolutionLayout>
  );
};
