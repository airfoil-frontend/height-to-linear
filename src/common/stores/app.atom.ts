import { atom } from 'jotai';

import { AppState } from '@/common/types/app';

const initialState: AppState = {
  formStatus: 'connect-form',
};

export const appAtom = atom<AppState>(initialState);
appAtom.debugLabel = 'app';
