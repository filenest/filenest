export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type SetterGetter<T> = { value: T; set: SetState<T> }
