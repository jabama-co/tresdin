import consola from "consola";
import path from "path";
import { register } from "ts-node";

export default async (root: string) => {
    register();

    let config: any = null;
    const configPath = path.resolve(root, "tresdin.config.ts");
    try {
        config = await import(configPath);
        if (config.default) {
            config = config.default;
        }
    } catch (e) {
        if (e.code !== "MODULE_NOT_FOUND") {
            throw e;
        } else {
            consola.fatal("Cannot find `tresdin.config.ts`");
            process.exit(1);
        }
    }
    return config;
};
