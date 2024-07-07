import * as path from "path"
import { defineConfig } from "rspress/config"

export default defineConfig({
    root: path.join(__dirname, "docs"),
    title: "Filenest",
    description: "Building blocks for your own React file browser, connecting your favorite CDN with your app",
    icon: "/logo.svg",
    logo: {
        light: "/logo.png",
        dark: "/logo.png",
    },
    themeConfig: {
        socialLinks: [{ icon: "github", mode: "link", content: "https://github.com/filenest/filenest" }],
        footer: {
            message: "Made with ❤️ by @nordowl",
        },
    },
    globalStyles: path.join(__dirname, "styles/index.css"),
})
