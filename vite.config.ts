import { resolve, } from 'path'
import { renameSync } from 'fs'
import { defineConfig } from 'vite'
import { name, dependencies } from "./package.json"
import dts from "vite-plugin-dts"

export default defineConfig(({ command, mode, ssrBuild }) => {
    console.log(command, mode);

    switch (command) {
        case 'serve':
            if (mode === 'pages') {
                return {
                    server: {
                        host: true,
                        port: 666,
                    },
                    build: {
                        outDir: "../docs",
                    },
                    preview: {
                        port: 666
                    },
                    root: "./pages"
                }
            } else {
                return {
                    server: {
                        host: true,
                        port: 999
                    },
                    build: {
                        outDir: "./dist"
                    },
                    preview: {
                        port: 999
                    },
                    root: "./cypress/pages",
                }
            }
        case 'build':
            if (mode === 'pages') {
                return {
                    root: "./pages",
                    build: {
                        outDir: "../docs"
                    },
                    base: ''
                }
            } else if (mode === 'tests' || mode === 'production') {
                return {
                    root: "./cypress/pages",
                    build: {
                        outDir: "./dist"
                    },
                    base: ''
                }
            } else {
                return {
                    build: {
                        lib: {
                            entry: resolve(__dirname, 'src/index.ts'),
                            name: name,
                            fileName: 'index',
                            formats: ['es', 'cjs'],
                        },
                        rollupOptions: {
                            external: Object.keys(dependencies)
                        },
                    },
                    plugins: [dts({
                        rollupTypes: true,
                        afterBuild() {
                            renameSync(resolve(__dirname, 'dist/types.d.ts'), resolve(__dirname, 'dist/index.d.ts'))
                        },
                    })]
                }
            }
    }
})