import { createSelector, makeLazy } from 'reselect';

const shouldFilter$ = state => state.shouldFilter;
const hugeList$ = state => state.hugeList;
const keyword$ = state => state.keyword;

const filteredList$ = createSelector(
  [hugeList$, keyword$],
  (hugeList, keyword) => {
    // expensive computation
    return filteredList;
  }
);

const finalList$ = createSelector(
  [shouldFilter$, hugeList$, makeLazy(filteredList$)],
  (shouldFilter, hugeList, filteredList) => {
    return shouldFilter ? filteredList() : hugeList;
  }
);

const finalList$ = createSelector(
  [shouldFilter$, hugeList$, makeLazy(filteredList$)],
  (shouldFilter, hugeList, filteredList) => {
    return shouldFilter ? filteredList.unwrap() : hugeList;
  }
);

