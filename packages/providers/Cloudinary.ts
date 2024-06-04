import { GetResourcesByFolderInput, GetResourcesInput, Provider } from "."

export class Cloudinary implements Provider {
    private url: string
    private maxResults = 50

    constructor(config: { API_KEY: string; API_SECRET: string; CLOUD_NAME: string }) {
        const { API_KEY, API_SECRET, CLOUD_NAME } = config
        this.url = `https://${API_KEY}:${API_SECRET}@api.cloudinary.com/v1_1/${CLOUD_NAME}`
    }

    private getFolderExpression(folder: string) {
        if (folder) return `folder=${folder}`
        return 'folder=""'
    }

    private buildExpression(args: string[]) {
        return args.join(" ")
    }

    public async getResources({ searchQuery }: GetResourcesInput = { searchQuery: "" }) {
        const url = () => {
            if (searchQuery)
                return `${this.url}/resources/search?expression=${searchQuery}&max_results=${this.maxResults}`
            return `${this.url}/resources?max_results=${this.maxResults}`
        }

        const assets = await fetch(url()).then((res) => res.json())

        return {
            data: assets.resources,
            count: assets.total_count,
        } satisfies Awaited<ReturnType<Provider["getResources"]>>
    }

    public async getResourcesByFolder(
        { folder, searchQuery }: GetResourcesByFolderInput = { folder: "", searchQuery: "" }
    ) {
        const expression = searchQuery
            ? this.buildExpression([this.getFolderExpression(folder), `&& ${searchQuery}`])
            : this.buildExpression([this.getFolderExpression(folder)])

        const url = `${this.url}/resources/search?expression=${expression}&max_results=${this.maxResults}`
        const assets = await fetch(url).then((res) => res.json())

        return {
            folder,
            resources: {
                folders: assets.folders,
                resources: {
                    data: assets.resources,
                    count: assets.total_count,
                },
            },
        } satisfies Awaited<ReturnType<Provider["getResourcesByFolder"]>>
    }
}
