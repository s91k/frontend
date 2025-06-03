import { useState, useMemo, useCallback, createContext } from "react";
import { DataGuideItemId } from "./guide-items";

export type ItemRefCount = Record<DataGuideItemId, number>;

interface DataGuideContext {
  pushGuideItems: (items: DataGuideItemId[]) => void;
  popGuideItems: (items: DataGuideItemId[]) => void;
}

export const DataGuideContext = createContext<DataGuideContext>({
  pushGuideItems: () => {},
  popGuideItems: () => {},
});

export const itemsToShow = (itemRefCount: ItemRefCount) =>
  Object.entries(itemRefCount)
    .filter(([_id, refCount]) => refCount > 0)
    .map(([id, _refCount]) => id as DataGuideItemId);

export const useTrackGuideItems = () => {
  const [itemRefCount, setItemRefCount] = useState({} as ItemRefCount);

  const items = useMemo(() => itemsToShow(itemRefCount), [itemRefCount]);

  const pushItems = useCallback(
    (items: DataGuideItemId[]) => {
      setItemRefCount((oldRefCount) =>
        items.reduce(
          (acc, id) => ({
            ...acc,
            [id]: (acc[id] || 0) + 1,
          }),
          oldRefCount,
        ),
      );
    },
    [setItemRefCount],
  );

  const popItems = useCallback(
    (items: DataGuideItemId[]) => {
      setItemRefCount((oldRefCount) =>
        items.reduce(
          (acc, id) => ({
            ...acc,
            [id]: Math.max(0, (acc[id] || 1) - 1),
          }),
          oldRefCount,
        ),
      );
    },
    [setItemRefCount],
  );

  return { items, pushItems, popItems };
};
