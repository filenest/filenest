"use client"

import { AssetListProvider, useAssetListContext } from "../context/AssetListContext"

const AssetListWrapper = (props: AssetListProps) => {
    return (
        <AssetListProvider>
            <AssetList {...props}/>
        </AssetListProvider>
    )
}

interface RenderProps {
    assets?: ReturnType<typeof useAssetListContext>["assets"]
    isLoading: boolean
    isLoadingMore: boolean
}

export interface AssetListProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

const AssetList = ({ children, ...props }: AssetListProps) => {
    const { assets, isLoading, isLoadingMore, dropzone } = useAssetListContext()

    function getChildren() {
        if (typeof children === "function") {
            return children({ assets, isLoading, isLoadingMore })
        }

        return children
    }

    const { getRootProps, getInputProps } = dropzone

    return (
        <div
            {...getRootProps({...props})}
        >
            <input {...getInputProps()} />
            <>{getChildren()}</>
        </div>
    )
}

export { AssetListWrapper as AssetList }