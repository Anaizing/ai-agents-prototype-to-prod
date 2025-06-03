import 'dotenv/config'
import { join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname } from 'path'
import { readdir } from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log("You're in!")

const main = async () => {
    const evalName = process.argv[2]
    const experimentsDir = join(__dirname, 'experiments')

    try {
        if (evalName) {
            const evalPath = join(experimentsDir, `${evalName}.eval.ts`)
            const evalUrl = pathToFileURL(evalPath).href // Convert to file:// URL
            await import(evalUrl)
        } else {
            const files = await readdir(experimentsDir)
            const evalFiles = files.filter((file) => file.endsWith('.eval.ts'))

            for (const evalFile of evalFiles) {
                const evalPath = join(experimentsDir, evalFile)
                const evalUrl = pathToFileURL(evalPath).href // Convert to file:// URL
                await import(evalUrl)
            }
        }
    } catch (error) {
        console.error(
            `Failed to run eval${evalName ? ` '${evalName}'` : 's'}:`,
            error
        )
        process.exit(1)
    }
}

main()