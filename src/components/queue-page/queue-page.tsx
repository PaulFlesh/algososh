import React from "react";
import { nanoid } from "nanoid";
import styles from './queue-page.module.css';
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { useForm } from "../../hooks/useForm";
import { timeout, setCircleState } from "../../utils/utils";
import { IResultObj } from "../../types/result";
import { Queue } from "./queue-class";

const queue = new Queue<IResultObj>(7);

const getEmptyQueue = (length: number): Array<IResultObj> => {
  return Array.from({ length }, () => {
    const emptyObject: IResultObj = {
      value: "",
      modified: false,
      changing: false
    };
    return emptyObject;
  });
};

export const QueuePage: React.FC = () => {
  const [loader, setLoader] = React.useState(false);
  const [resultArray, setResultArray] = React.useState<{ array: Array<IResultObj> }>({ array: getEmptyQueue(queue.getSize()) });
  const { values, handleChange, setValues } = useForm<{ text: string }>({ text: '' });

  async function enqueue() {
    setLoader(true);
    let enqueuedItem: IResultObj | null = null;
    let arrayOfItems: Array<IResultObj> = [...resultArray.array];
    if (values.text) {
      enqueuedItem = {
        value: values.text,
        modified: false,
        changing: true
      };
    }
    if (enqueuedItem) {
      arrayOfItems[queue.getTailIndex()] = enqueuedItem;
      queue.enqueue(enqueuedItem);
      let lastElementInQueue = queue.peak();
      if (lastElementInQueue) {
        setResultArray({ array: arrayOfItems });
        setValues({ text: '' });
        await timeout(SHORT_DELAY_IN_MS);
        let lastElement = arrayOfItems[queue.getTailIndex() - 1];
        lastElement.changing = !lastElement.changing;
        setResultArray({ array: arrayOfItems });
      }
    }
    setLoader(false);
  }

  async function dequeue() {
    setLoader(true);
    let headElementInQueue: IResultObj | null = queue.peak();
    let arr: Array<IResultObj> = [...resultArray.array];
    if (headElementInQueue) {
      headElementInQueue.changing = true;
      await timeout(SHORT_DELAY_IN_MS);
      setResultArray({ array: arr });
      arr[queue.getHeadIndex()].value = "";
      arr[queue.getHeadIndex()].changing = false;
      queue.dequeue();
    }
    setResultArray({ array: [...arr] });
    setLoader(false);
  }

  return (
    <SolutionLayout title="Очередь">
      <div className={styles.container}>
        <div className={styles.input}>
          <Input
            name="text"
            onChange={(e) => handleChange(e)}
            isLimitText={true}
            maxLength={4}
            value={values.text ? values.text : ""}
            data-testid="input"
          />
          <Button
            text='Добавить'
            onClick={enqueue}
            disabled={!values.text || queue.isFilled()
            }
            isLoader={loader}
            data-testid="enqueue"
          />
          <Button
            text='Удалить'
            onClick={dequeue}
            disabled={queue.isEmpty()}
            isLoader={loader}
            data-testid="dequeue"
          />
          <Button
            text='Очистить'
            extraClass="ml-40"
            onClick={() => {
              setResultArray({ array: getEmptyQueue(queue.getSize()) });
              queue.clear();
            }}
            disabled={
              (queue.isEmpty()) &&
              !(queue.getHeadIndex() === queue.getSize() - 1)
            }
            isLoader={loader}
            data-testid="clear"
          />
        </div>
        {resultArray && (
          <div className={styles.result} data-testid='result'>
            {resultArray.array.length
              ? resultArray.array.map((item, index) => {
                const headIndex = queue.getHeadIndex();
                const tailIndex = queue.getTailIndex() - 1;
                const circleState = setCircleState(item);
                return (
                  <Circle
                    state={circleState}
                    index={index}
                    key={nanoid()}
                    letter={item.value}
                    head={index === headIndex && queue.getTailIndex() ? "head" : ""}
                    tail={index === tailIndex && !queue.isEmpty() ? "tail" : ""}
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
