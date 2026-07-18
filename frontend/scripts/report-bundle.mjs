import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const assetsDirectory = path.resolve("dist/assets");
const warningLimit = 500 * 1024;

async function collectFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) files.push(...await collectFiles(fullPath));
        else files.push(fullPath);
    }

    return files;
}

try {
    const files = await collectFiles(assetsDirectory);
    const rows = [];

    for (const file of files) {
        const fileStat = await stat(file);
        rows.push({
            file: path.relative(path.resolve("dist"), file),
            bytes: fileStat.size,
            kilobytes: fileStat.size / 1024,
        });
    }

    rows.sort((a, b) => b.bytes - a.bytes);
    console.table(rows.map(({ file, kilobytes }) => ({ file, "tamanho (kB)": kilobytes.toFixed(2) })));

    const oversized = rows.filter(({ bytes, file }) => file.endsWith(".js") && bytes > warningLimit);

    if (oversized.length > 0) {
        console.error(`\n${oversized.length} chunk(s) JavaScript ultrapassam 500 kB.`);
        process.exitCode = 1;
    } else {
        console.log("\nTodos os chunks JavaScript estão abaixo de 500 kB.");
    }
} catch (error) {
    console.error("Não foi possível gerar o relatório do bundle. Execute npm run build antes.");
    console.error(error.message);
    process.exitCode = 1;
}
