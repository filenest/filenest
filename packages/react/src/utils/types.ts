export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type RenderMode = "bundle" | "dialog" | "uploader"

export type AssetExtraProps = { isLoading: boolean }