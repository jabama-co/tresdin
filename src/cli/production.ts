import Consola from "consola";
import path from "path";

export default async (root: string) => {
    const productionRoot = path.resolve(root, ".tresdin");
    const configPath = path.resolve(productionRoot, "tresdin.config.js");
    let config: any = null;
    try {
        config = await import(configPath);
        if (config.default) {
            config = config.default;
        }
    } catch (e) {
        if (e.code !== "MODULE_NOT_FOUND") {
            throw e;
        } else {
            Consola.fatal("Cannot find build, you may run `yarn tresdin build` first");
            process.exit(1);
        }
    }

    return {
        config,
        root: productionRoot,
    };
};
