import React from "react";
import { nanoid } from "nanoid";
import styles from "./list-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { useForm } from "../../hooks/useForm";
import { timeout, setCircleState } from "../../utils/utils";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { ElementStates } from "../../types/element-states";
import { LinkedList } from "./list-class";
import { IResultObj } from "../../types/result";

const list = new LinkedList<IResultObj>([0, 34, 8, 1]);

type TClickButton = {
  [name: string]: boolean;
  addToHead: boolean;
  addToTail: boolean;
  deleteFromHead: boolean;
  deleteFromTail: boolean;
  addByIndex: boolean;
  deleteByIndex: boolean;
};

interface IChangingElement {
  element: IResultObj | null;
  changeAt: number;
  toAdd: boolean;
  toDelete: boolean;
}

export const ListPage: React.FC = () => {
  const [changingElement, setChangingElement] = React.useState<IChangingElement | null>(null);
  const [eventState, setEventState] = React.useState<TClickButton>({
    addToHead: false,
    addToTail: false,
    deleteFromHead: false,
    deleteFromTail: false,
    addByIndex: false,
    deleteByIndex: false
  });
  const [resultArray, setResultArray] = React.useState<{ array: Array<IResultObj> }>({ array: list.toArray() });
  const { values, setValues, handleChange } = useForm<{ text: string | null; index: number | null }>({
    text: null,
    index: null
  });

  const changingItem = (
    changingValue: IResultObj,
    arr: Array<IResultObj>,
    changingIndex: number
  ) => {
    const notBoundaryItems =
      changingIndex !== 0 && changingIndex !== arr.length;
    if (notBoundaryItems) {
      for (let i = 0; i <= changingIndex; i++) {
        arr[i].changing = false;
      }
    }
    changingValue.changing = false;
    changingValue.modified = true;
    arr.splice(changingIndex, 0, changingValue);
    setResultArray({ array: arr });
    setChangingElement(null);
  };

  const deleteValue = (
    arr: Array<IResultObj>,
    changingIndex: number
  ) => {
    for (let i = 0; i <= changingIndex; i++) {
      arr[i].changing = false;
    }
    arr.splice(changingIndex, 1);
    setResultArray({ array: arr });
    setChangingElement(null);
  };

  async function addValueToList(
    buttonName: keyof TClickButton,
    position: "head" | "tail" | number
  ) {
    setValues({ index: null, text: null });
    setEventState({ ...eventState, [buttonName]: true });

    let insertedValue: IResultObj | null = null;
    let arrayOfItems: Array<IResultObj> = [...resultArray.array];

    if (values.text) {
      insertedValue = {
        value: values.text,
        modified: false,
        changing: true
      };
    }
    if (insertedValue) {
      const currentChangingElement: IChangingElement = {
        element: insertedValue,
        changeAt: 0,
        toAdd: true,
        toDelete: false,
      };
      if (position === "head") {
        list.addByIndex(insertedValue, 0);
        setChangingElement(currentChangingElement);
        await timeout(SHORT_DELAY_IN_MS);
        if (insertedValue) {
          changingItem(insertedValue, arrayOfItems, 0);
        }
        await timeout(SHORT_DELAY_IN_MS);
        if (insertedValue) {
          insertedValue.modified = false;
          setResultArray({ array: arrayOfItems });
        }
      }
      if (position === "tail") {
        const lastIndex = arrayOfItems.length - 1;
        list.append(insertedValue);
        setChangingElement({
          ...currentChangingElement,
          changeAt: lastIndex,
        });
        await timeout(SHORT_DELAY_IN_MS);
        if (insertedValue) {
          changingItem(insertedValue, arrayOfItems, lastIndex + 1);
        }
        await timeout(SHORT_DELAY_IN_MS);
        if (insertedValue) {
          insertedValue.modified = false;
          setResultArray({ array: arrayOfItems });
        }
      }
      if (typeof position === "number") {
        list.addByIndex(insertedValue, position);
        for (let i = 0; i <= position; i++) {
          await timeout(SHORT_DELAY_IN_MS);
          setChangingElement({ ...currentChangingElement, changeAt: i });
          if (i > 0) {
            arrayOfItems[i - 1].changing = true;
          }
          setResultArray({ array: [...arrayOfItems] });
        };
        await timeout(SHORT_DELAY_IN_MS);
        if (insertedValue) {
          changingItem(insertedValue, arrayOfItems, position);
        }
        await timeout(SHORT_DELAY_IN_MS);
        if (insertedValue) {
          insertedValue.modified = false;
          setResultArray({ array: arrayOfItems });
        }
      }
    };
    setEventState({ ...eventState, [buttonName]: false });
  }

  async function deleteValueFromList(
    buttonName: keyof TClickButton,
    position: "head" | "tail" | number
  ) {
    setValues({ index: null, text: null });
    setEventState({ ...eventState, [buttonName]: true });
    let arr: Array<IResultObj> = [...resultArray.array];
    let positionIndex: number = 0;
    if (position === "head") {
      positionIndex = 0;
    } else if (position === "tail") {
      positionIndex = arr.length - 1;
    };
    let currentChangingElement: IChangingElement = {
      element: null,
      changeAt: 0,
      toAdd: true,
      toDelete: false,
    };
    if (position === "head" || position === "tail") {
      list.deleteByIndex(positionIndex);
      const deletedElement = Object.assign(
        {},
        resultArray.array[positionIndex]
      );
      if (deletedElement) {
        currentChangingElement.element = deletedElement;
        currentChangingElement.toDelete = true;
        currentChangingElement.changeAt = positionIndex;
        arr[positionIndex].value = "";
        setChangingElement(currentChangingElement);
        setResultArray({ array: arr });
        await timeout(SHORT_DELAY_IN_MS);
        deleteValue(arr, positionIndex);
        setChangingElement(null);
      }
    } else if (typeof position === "number") {
      list.deleteByIndex(position);
      const deletedElement = Object.assign({}, resultArray.array[position]);
      for (let i = 0; i <= position; i++) {
        await timeout(SHORT_DELAY_IN_MS);
        arr[i].changing = true;
        setResultArray({ array: [...arr] });
      };
      await timeout(SHORT_DELAY_IN_MS);
      arr[position].changing = false;
      setResultArray({ array: [...arr] });
      currentChangingElement.element = deletedElement;
      currentChangingElement.toDelete = true;
      currentChangingElement.changeAt = position;
      arr[position].value = "";
      setChangingElement(currentChangingElement);
      setResultArray({ array: arr });
      await timeout(SHORT_DELAY_IN_MS);
      deleteValue(arr, position);
    };
    setResultArray({ array: [...arr] });
    setEventState({ ...eventState, [buttonName]: false });
  }
  return (
    <SolutionLayout title="Связный список">
      <div className={styles.container}>
        <div className={styles.controls}>
          <Input
            placeholder="Введите значение"
            name="text"
            onChange={(e) => {
              handleChange(e);
            }}
            isLimitText={true}
            maxLength={4}
            value={values.text ? values.text : ""}
          />
          <Button
            text="Добавить в head"
            onClick={() => {
              addValueToList("addToHead", "head");
            }}
            disabled={!values.text}
            isLoader={eventState.addToHead}
            linkedList="small"
          />
          <Button
            text="Добавить в tail"
            onClick={() => {
              addValueToList("addToTail", "tail");
            }}
            disabled={!values.text}
            isLoader={eventState.addToTail}
            linkedList="small"
          />
          <Button
            text="Удалить из head"
            onClick={() => {
              deleteValueFromList("deleteFromHead", "head");
            }}
            disabled={!resultArray.array.length}
            isLoader={eventState.deleteFromHead}
            linkedList="small"
          />
          <Button
            text="Удалить из tail"
            onClick={() => {
              deleteValueFromList("deleteFromTail", "tail");
            }}
            disabled={!resultArray.array.length}
            isLoader={eventState.deleteFromTail}
            linkedList="small"
          />
        </div>
        <div className={styles.controls}>
          <Input
            placeholder="Введите индекс"
            name="index"
            type="number"
            max={list.getSize() - 1}
            value={values.index ? values.index : ""}
            onChange={(e) => {
              handleChange(e);
              if (Number(e.currentTarget.value) > list.getSize() - 1) {
                setValues({ ...values, index: list.getSize() - 1 });
              }
              if (Number(e.currentTarget.value) < 0) {
                setValues({ ...values, index: 0 });
              }
            }}
          />
          <Button
            text="Добавить по индексу"
            onClick={() => {
              addValueToList("addByIndex", Number(values.index));
            }}
            disabled={!(values.text && values.index)}
            isLoader={eventState.addByIndex}
            linkedList="big"
            extraClass={styles.wide_button}
          />
          <Button
            text="Удалить по индексу"
            onClick={() => {
              deleteValueFromList("deleteByIndex", Number(values.index));
            }}
            disabled={!(values.index && resultArray.array.length)}
            isLoader={eventState.deleteByIndex}
            linkedList="big"
            extraClass={styles.wide_button}
          />
        </div>
        <div className={styles.result}>
          {resultArray.array.length
            ? resultArray.array.map((item, index) => {
              const lastIndex = resultArray.array.length - 1;
              const headElement =
                index === 0 ? (
                  changingElement &&
                    changingElement.changeAt === 0 &&
                    !changingElement.toDelete ? (
                    <Circle
                      state={ElementStates.Changing}
                      letter={changingElement.element?.value}
                      isSmall={true}
                    />
                  ) : "head"
                ) : "";
              const tailElement =
                index === lastIndex ? (
                  changingElement &&
                    changingElement.changeAt === lastIndex &&
                    changingElement.toDelete ? (
                    <Circle
                      state={ElementStates.Changing}
                      letter={changingElement.element?.value}
                      isSmall={true}
                    />
                  ) : "tail"
                ) : "";
              const anotherIndexElement =
                changingElement && changingElement.changeAt === index ? (
                  <Circle
                    state={ElementStates.Changing}
                    letter={changingElement.element?.value}
                    isSmall={true}
                  />
                ) : "";
              const circleState = setCircleState(item);
              const head =
                index === 0
                  ? headElement
                  : changingElement?.toAdd &&
                    (eventState.addByIndex || eventState.addToTail)
                    ? anotherIndexElement
                    : "";
              const tail =
                index === lastIndex
                  ? tailElement
                  : changingElement?.toDelete
                    ? anotherIndexElement
                    : "";

              return (
                <div
                  key={nanoid()}
                  className={styles.listing}
                >
                  <Circle
                    state={circleState}
                    index={index}
                    letter={item.value}
                    head={head}
                    tail={tail}
                  />
                  {index === lastIndex ? null : <ArrowIcon />}
                </div>
              );
            })
            : null}
        </div>
      </div>
    </SolutionLayout>
  )
}
