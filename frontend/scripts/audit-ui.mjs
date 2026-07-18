import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const sourceDirectory = path.resolve("src");
const forbiddenPatterns = [
    { pattern: /from\s+["']react-icons\//, message: "importação de react-icons" },
    { pattern: /<select\b/, message: "select nativo visível" },
    { pattern: /type=["']date["']/, message: "input date nativo" },
    { pattern: /type=["']color["']/, message: "input color nativo" },
];

async function collectSourceFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) files.push(...await collectSourceFiles(fullPath));
        else if (/\.(js|jsx)$/.test(entry.name)) files.push(fullPath);
    }

    return files;
}

const violations = [];
const files = await collectSourceFiles(sourceDirectory);

for (const file of files) {
    const source = await readFile(file, "utf8");

    for (const rule of forbiddenPatterns) {
        if (rule.pattern.test(source)) {
            violations.push(`${path.relative(sourceDirectory, file)}: ${rule.message}`);
        }
    }
}

if (violations.length > 0) {
    console.error("Auditoria visual encontrou violações:\n");
    violations.forEach((violation) => console.error(`- ${violation}`));
    process.exitCode = 1;
} else {
    console.log(`Auditoria visual aprovada em ${files.length} arquivos.`);
}
