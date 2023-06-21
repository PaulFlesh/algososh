import React from "react";
import { nanoid } from "nanoid";
import styles from './stack.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { useForm } from "../../hooks/useForm";
import { timeout, setCircleState, isEmpty } from "../../utils/utils";
import { IResultObj } from "../../types/result";
import { Stack } from "./stack-class";

const stack = new Stack<IResultObj>();

export const StackPage: React.FC = () => {
  const [loader, setLoader] = React.useState(false);
  const [resultArray, setResultArray] = React.useState<{ array: Array<IResultObj> }>({ array: [] });
  const { values, setValues, handleChange } = useForm<{ text: string }>({ text: '' });

  async function push() {
    setLoader(true);
    let pushedItem: IResultObj | null = null;
    if (values.text) {
      pushedItem = {
        value: values.text,
        modified: false,
        changing: true
      };
    }
    if (pushedItem) {
      stack.push(pushedItem);
      setValues({ text: '' });
      setResultArray({ array: stack.getStack() });
      await timeout(SHORT_DELAY_IN_MS);
      pushedItem.changing = false;
    }
    setLoader(false);
  };

  async function pop() {
    setLoader(true);
    let last = stack.peak();
    if (last) {
      last.changing = true;
      await timeout(SHORT_DELAY_IN_MS);
      stack.pop();
      setResultArray({ array: stack.getStack() });
    }
    setLoader(false);
  };

  return (
    <SolutionLayout title="Стек">
      <div className={styles.container}>
        <div className={styles.input}>
          <Input
            name="text"
            isLimitText={true}
            maxLength={4}
            value={values.text ? values.text : ""}
            onChange={(e) => handleChange(e)}
            data-testid="input"
          />
          <Button
            text='Добавить'
            onClick={push}
            isLoader={loader}
            disabled={isEmpty(values.text)}
            data-testid="push" />
          <Button
            text='Удалить'
            onClick={pop}
            isLoader={loader}
            disabled={!resultArray.array.length}
            data-testid="pop" />
          <Button
            text='Очистить'
            extraClass="ml-40"
            onClick={() => {
              stack.clear();
              setResultArray({ array: stack.getStack() });
            }}
            isLoader={loader}
            disabled={!resultArray.array.length}
            data-testid="clear"
          />
        </div>
        {resultArray && (
          <div className={styles.result} data-testid='result'>
            {resultArray.array.length
              ? resultArray.array.map((item, index) => {
                const lastIndex = resultArray.array.length - 1;
                const circleState = setCircleState(item);
                return (
                  <Circle
                    state={circleState}
                    index={index}
                    key={nanoid()}
                    letter={item.value}
                    head={index === lastIndex ? "top" : ""}
                  />
                );
              })
              : null}
          </div>
        )}
      </div>
    </SolutionLayout>
  );
};
