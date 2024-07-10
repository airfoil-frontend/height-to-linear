import { FORM_STATUS } from '@/common/constants/app';

export type FormStatus = (typeof FORM_STATUS)[number];

export type AppState = {
  formStatus: FormStatus;
};
