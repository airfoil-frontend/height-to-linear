import { atom } from 'jotai';

import { HeightState } from '@/common/types/height';

const initialState: HeightState = {
  data: [],
  statuses: [],
  priorities: [],
};

export const heightAtom = atom<HeightState>(initialState);
heightAtom.debugLabel = 'height';
