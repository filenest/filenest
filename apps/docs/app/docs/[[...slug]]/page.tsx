import { source } from "@/lib/source"
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from "fumadocs-ui/page"
import { notFound, redirect } from "next/navigation"
import defaultMdxComponents, { createRelativeLink } from "fumadocs-ui/mdx"
import { ImageZoom } from "fumadocs-ui/components/image-zoom"

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params

  if (!params.slug) {
    redirect("/docs/introduction")
  }

  const page = source.getPage(params.slug)
  if (!page) notFound()

  const MDXContent = page.data.body

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      editOnGithub={{
        owner: "filenest",
        repo: "filenest",
        sha: "main",
        path: `/apps/docs/content/docs/${page.file.path}`,
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent
          components={{
            ...defaultMdxComponents,
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
            img: (props) => <ImageZoom {...(props as any)} />,
            // you can add other MDX components here
          }}
        />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  return {
    title: page.data.title + " | Filenest",
    description: page.data.description,
  }
}
