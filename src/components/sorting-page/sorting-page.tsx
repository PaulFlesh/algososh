import React from "react";
import styles from "./sorting.module.css";
import { nanoid } from "nanoid";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Direction } from "../../types/direction";
import { Column } from "../ui/column/column";
import { swap, timeout, setCircleState } from "../../utils/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { IResultObj } from "../../types/result";

export const SortingPage: React.FC = () => {
  const [sortType, setSortType] = React.useState<"selection" | "bubble">("selection");
  const [direction, setDirection] = React.useState<"asc" | "desc" | boolean>(false);
  
  const randomArr = (minLen: number, maxLen: number): Array<IResultObj> => {
    const len = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;
    return Array.from({ length: len }, () => {
      return {
        value: Math.floor(Math.random() * 100).toString(),
        modified: false,
        changing: false
      };
    });
  };

  const [resultArray, setResultArray] = React.useState<IResultObj[]>(randomArr(3, 17));

  const modifyArray = (array: Array<IResultObj>, start: number, end: number) => {
    if (sortType === "bubble") {
      array[start].changing = true;
      array[end].changing = true;
      if (start >= 1 && array[start - 1].changing) {
        array[start - 1].changing = false;
      }
    } else {
      array[start].changing = true;
      array[end].changing = true;
      if (array[end - 1].changing && array[end - 1] !== array[start]) {
        array[end - 1].changing = false;
      }
    }
    return array;
  };

  const compareColumns = (
    firstColumn: IResultObj,
    secondColumn: IResultObj,
    mode: "biggest" | "smallest"
  ) => {
    if (mode === "biggest") {
      return Number(firstColumn.value) < Number(secondColumn.value)
        ? secondColumn
        : firstColumn;
    } else if (mode === "smallest") {
      return Number(firstColumn.value) < Number(secondColumn.value)
        ? firstColumn
        : secondColumn;
    } else {
      return secondColumn;
    }
  };

  async function selectionSort(array: IResultObj[], sorting: string | boolean) {
    const arr = [...array].map(item => {
      return { ...item, changing: false, modified: false };
    });
    let exchangedElement: { element: IResultObj; index: number } | null = null;

    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        let modifiedArray = modifyArray(arr, i, j);
        await timeout(SHORT_DELAY_IN_MS);
        setResultArray([...modifiedArray]);
        if (!exchangedElement) {
          exchangedElement = { element: arr[j], index: j };
        } else {
          exchangedElement.element =
            sorting === "desc"
              ? compareColumns(exchangedElement.element, arr[j], "biggest")
              : compareColumns(exchangedElement.element, arr[j], "smallest");
          if (exchangedElement.element === arr[j]) {
            exchangedElement.index = j;
          }
        }
      }

      arr[arr.length - 1].changing = false;
      await timeout(SHORT_DELAY_IN_MS);
      setResultArray([...arr]);
      if (exchangedElement) {
        if (
          sorting === "desc" &&
          Number(arr[i].value) < Number(exchangedElement.element.value)
        ) {
          arr[i].changing = false;
          arr[exchangedElement.index].changing = false;
          arr[exchangedElement.index].modified = true;
          setResultArray([...swap(arr, i, exchangedElement.index)]);
        }
        if (
          sorting === "asc" &&
          Number(arr[i].value) > Number(exchangedElement.element.value)
        ) {
          arr[i].changing = false;
          arr[exchangedElement.index].changing = false;
          arr[exchangedElement.index].modified = true;
          setResultArray([...swap(arr, i, exchangedElement.index)]);
        }
      }
      arr[i].changing = false;
      arr[i].modified = true;
      exchangedElement = null;
    }
    setResultArray([...arr]);
    setDirection(true);
  };

  async function bubbleSort(array: IResultObj[], sorting: string) {
    let arr = [...array].map(item => {
      return { ...item, changing: false, modified: false };
    });

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        await timeout(SHORT_DELAY_IN_MS);
        let modifiedArray = modifyArray(arr, j, j + 1);
        if (
          sorting === "desc" &&
          Number(arr[j].value) < Number(arr[j + 1].value)
        ) {
          swap(modifiedArray, j, j + 1);
        }
        if (
          sorting === "asc" &&
          Number(arr[j].value) > Number(arr[j + 1].value)
        ) {
          swap(modifiedArray, j, j + 1);
        }
        setResultArray([...modifiedArray]);
      }
      arr[arr.length - i - 1].changing = false;
      if (arr.length - i >= 2) {
        arr[arr.length - i - 2].changing = false;
      }
      arr[arr.length - i - 1].modified = true;
    }

    setResultArray([...arr]);
    setDirection(true);
  };

  return (
    <SolutionLayout title="Сортировка массива">
      <div className={styles.input}>
        <RadioInput
          value="selection"
          label="Выбор"
          checked={sortType === "selection"}
          onChange={() => setSortType("selection")}
          extraClass="mr-10"
        />
        <RadioInput
          value="bubble"
          label="Пузырёк"
          checked={sortType === "bubble"}
          onChange={() => setSortType("bubble")}
          extraClass="mr-20"
        />
        <Button
          sorting={Direction.Ascending}
          text="По возрастанию"
          onClick={() => {
            setDirection("asc");
            sortType === "selection"
            ? selectionSort(resultArray, "asc")
            : bubbleSort(resultArray, "asc")
          }}
          isLoader={direction === "asc"}
          disabled={direction === "desc" || !direction}
        />
        <Button
          sorting={Direction.Descending}
          text="По убыванию"
          onClick={() => {
            setDirection("desc");
            sortType === "selection"
            ? selectionSort(resultArray, "desc")
            : bubbleSort(resultArray, "desc")
          }}
          isLoader={direction === "desc"}
          disabled={direction === "asc" || !direction}
        />
        <Button
          text="Новый массив"
          onClick={() => {
            setResultArray(randomArr(3, 17));
            setDirection(true);
          }}
          disabled={direction === "asc" || direction === "desc"}
          extraClass="ml-40"
        />
      </div>
      {resultArray && (
        <div className={styles.result}>
          {resultArray.map(item => {
            return (
              <Column
                state={setCircleState(item)}
                key={nanoid()}
                index={item.value}
              />
            );
          })}
        </div>
      )}
    </SolutionLayout>
  )
}
