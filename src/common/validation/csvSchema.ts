import { z } from 'zod';

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_FILE_TYPES = ['text/csv'];

export const CsvSchema = z
  .instanceof(File)
  .refine(
    (file) => {
      return file.size <= MAX_UPLOAD_SIZE;
    },
    {
      message: `File size must be less than ${MAX_UPLOAD_SIZE / 1024 / 1024}MB`,
    },
  )
  .refine(
    (file) => {
      return !file || ACCEPTED_FILE_TYPES.includes(file.type);
    },
    { message: `File type must be a CSV` },
  );
