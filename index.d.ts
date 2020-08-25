export type TDBRow = {
  id: string;
  start: number;
  end: number;
};

export type TDBRowsCallback = (err: Error, rows: TDBRow[]) => void;

export type TDBRowCallback = (err: Error, rows: TDBRow) => void;

export type TMessage = (err: Error, rows: any) => void;
