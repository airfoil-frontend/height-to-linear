import Papa from 'papaparse';

export const parseCsv = (csv: string): any => {
  return new Promise((resolve, reject) => {
    Papa.parse(csv, {
      header: true,
      complete: (result: any) => {
        resolve(result);
      },
      error: (error: any) => {
        reject(error);
      },
    });
  });
};
