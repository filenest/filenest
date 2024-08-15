import * as path from "path"
import { defineConfig } from "rspress/config"
import { pluginShiki } from "@rspress/plugin-shiki"

export default defineConfig({
    root: path.join(__dirname, "_root"),
    base: "/filenest",
    title: "Filenest",
    description: "Building blocks for your own React file browser, connecting your favorite CDN with your app",
    icon: "/filenest-owl.svg",
    logo: {
        light: "/filenest-logo.svg",
        dark: "/filenest-logo.svg",
    },
    themeConfig: {
        socialLinks: [{ icon: "github", mode: "link", content: "https://github.com/filenest/filenest" }],
        footer: {
            message: "Made with ❤️ by <a href='https://github.com/nordowl' class='footer-link' target='blank'>nordowl</a>",
        },
        darkMode: false,
    },
    globalStyles: path.join(__dirname, "styles/index.css"),
    markdown: {
        showLineNumbers: true,
    },
    plugins: [pluginShiki() as any],
})
