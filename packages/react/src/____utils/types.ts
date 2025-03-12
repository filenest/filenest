export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type AssetExtraProps = { isLoading: boolean, isSelected: boolean }

export type WithoutChildren<T> = Omit<T, "children">