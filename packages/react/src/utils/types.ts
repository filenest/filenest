export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type AssetExtraProps = { isLoading: boolean }

export type WithoutChildren<T> = Omit<T, "children">