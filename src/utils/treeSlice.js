import { createSlice } from '@reduxjs/toolkit';

import { calcTreeColRowSpan } from './utils';
import { data } from './data';

const initialState = {
  source: data,
  matrix:[]
};

export const treeSlice = createSlice({
  name: 'calcTree',
  initialState,
  reducers: {
    commitMatrixData: (state, action) => {
      console.log(action.payload)
      state.matrix = action.payload;
    },
    commitSourceData: (state, action) => {
      state.source = action.payload;
    }
  }
});

export const selectMatrixData = (state) => state.calcTree.matrix;

export const selectSourceData = (state) => state.calcTree.source;

export const { commitMatrixData,commitSourceData } = treeSlice.actions;

export const calcTree = () => (dispatch, getState) => {
  const currentValue = selectSourceData(getState());
  console.log(currentValue)
  calcTreeColRowSpan(currentValue)
};

export default treeSlice.reducer;
