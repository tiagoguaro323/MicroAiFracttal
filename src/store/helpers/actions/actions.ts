export interface IAction<T> {
  type: string;
  payload: T;
}

export type ActionType<T> = (payload: T) => IAction<T>;

export default function CreateAction<T>(type: string): ActionType<T> {
  return (payload: T) => ({
    type,
    payload,
  });
}
