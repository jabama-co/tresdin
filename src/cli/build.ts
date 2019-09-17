import consola from "consola";
import fs from "fs";
import path from "path";
import * as ts from "typescript";

export default async (root: string) => {
    const files = getAllFiles(root, /.*\.ts$/, /(node_modules|\.tresdin)/);
    compile(files, {
      declaration: false,
      esModuleInterop: true,
      experimentalDecorators: true,
      lib: [
        "es2015",
      ],
      module: ts.ModuleKind.CommonJS,
      noImplicitAny: true,
      outDir: "./.tresdin",
      target: ts.ScriptTarget.ES5,
    });
};

/**
 * Find all files inside a dir, recursively.
 * @function getAllFiles
 * @param  {string} dir Dir path string.
 * @return {string[]} Array with all file names that are inside the directory.
 */
const getAllFiles = (dir: string, patern: RegExp, exclude?: RegExp): string[] =>
    fs.readdirSync(dir).reduce((files, file) => {
        const name = path.join(dir, file);
        const isDirectory = fs.statSync(name).isDirectory();
        if (exclude && file.match(exclude)) {
          return [...files];
        }
        if (!isDirectory && !file.match(patern)) {
            return [...files];
        }
        return isDirectory ? [...files, ...getAllFiles(name, patern)] : [...files, name];
    }, []);

function compile(fileNames: string[], options: ts.CompilerOptions): void {
  const program = ts.createProgram(fileNames, options);
  const emitResult = program.emit();

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start!,
      );
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n",
      );
      consola.error(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`,
      );
    } else {
      consola.warn(
        `${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`,
      );
    }
  });

  if (emitResult.emitSkipped) {
    consola.fatal("Build Fail");
    process.exit(1);
  } else {
    consola.success("Build Complete");
    process.exit(0);
  }
}
