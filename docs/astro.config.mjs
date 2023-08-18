import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
    base: "/Djazztro",
    site: "https://bwc9876.github.io",
    integrations: [
        starlight({
            title: "Djazztro",
            logo: {
                src: "./src/assets/Djazztro-Logo.png"
            },
            favicon: "favicon.png",
            editLink: {
                baseUrl: "https://github.com/withastro/starlight/edit/main/docs"
            },
            social: {
                github: "https://github.com/Bwc9876/Djazztro"
            },
            sidebar: [
                {
                    label: "Start Here",
                    items: [
                        { label: "Introduction", link: "/guides/introduction" },
                        { label: "Getting Started", link: "/guides/getting-started" }
                    ]
                },
                {
                    label: "Reference",
                    autogenerate: { directory: "reference" }
                }
            ],
            customCss: ["./src/styles.css"]
        })
    ],

    image: { service: { entrypoint: "astro/assets/services/sharp" } }
});
