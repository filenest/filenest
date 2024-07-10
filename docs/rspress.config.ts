import * as path from "path"
import { defineConfig } from "rspress/config"

export default defineConfig({
    root: path.join(__dirname, "_root"),
    title: "Filenest",
    description: "Building blocks for your own React file browser, connecting your favorite CDN with your app",
    icon: "/logo.svg",
    logo: {
        light: "/logo.svg",
        dark: "/logo.svg",
    },
    themeConfig: {
        socialLinks: [{ icon: "github", mode: "link", content: "https://github.com/filenest/filenest" }],
        footer: {
            message: "Made with ❤️ by <a href='https://github.com/nordowl' class='footer-link' target='blank'>nordowl</a>",
        },
        darkMode: false,
    },
    globalStyles: path.join(__dirname, "styles/index.css"),
})
