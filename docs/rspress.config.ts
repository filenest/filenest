import * as path from "path"
import { defineConfig } from "rspress/config"

export default defineConfig({
    root: path.join(__dirname, "docs"),
    title: "Filenest",
    description: "Building blocks for your own React file browser, connecting your favorite CDN with your app",
    icon: "/rspress-icon.png",
    logo: {
        light: "/rspress-light-logo.png",
        dark: "/rspress-dark-logo.png",
    },
    themeConfig: {
        socialLinks: [{ icon: "github", mode: "link", content: "https://github.com/web-infra-dev/rspress" }],
    },
})
