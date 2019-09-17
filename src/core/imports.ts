import consola from "consola";
import path from "path";

const localNodeModules = path.resolve(process.cwd(), "node_modules");

// Prefer importing modules from local node_modules (for NPX and global bin)
async function _import(modulePath: string) {
  let m;
  for (const mp of [ path.resolve(localNodeModules, modulePath), modulePath ]) {
    try {
      m = await import(mp);
      break;
    } catch (e) {
      if (e.code !== "MODULE_NOT_FOUND") {
        throw e;
      } else if (mp === modulePath) {
        consola.fatal(
          `Module ${modulePath} not found.\n\n` +
          `Please install missing dependency:\n\n` +
          `Using npm:  npm i ${modulePath}\n\n` +
          `Using yarn: yarn add ${modulePath}`,
        );
      }
    }
  }
  return m;
}

export const importModule = _import;
