import { atom } from 'jotai';

import { LinearState } from '@/common/types/linear';

const initialState: LinearState = {
  apiKey: '',
  user: undefined,
  isConnected: false,
};

export const linearAtom = atom<LinearState>(initialState);
linearAtom.debugLabel = 'linear';
