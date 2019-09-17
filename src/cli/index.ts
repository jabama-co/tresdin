import consola from "consola";
import fs from "fs";
import path from "path";
import Core from "../core/Core";

async function run(args: string[]) {
    const { argv, root } = await getArgs(args);

    switch (argv[0]) {
      case "build": await build(root); break;
      case "start": await start(root); break;
      case "dev": await dev(root); break;
      default:
        consola.fatal("Invalid arg");
        process.exit(2);
    }
}

async function dev(root: string) {
  const development = require("./development").default;

  const config = await development(root);
  await startServer(root, config);
}

async function start(root: string) {
  const production = require("./production").default;

  const result = await production(root);

  startServer(result.root, result.config);
}

async function startServer(root: string, config: any) {
  const server = new Core(root, config);

  return await server.start();
}

async function build(root: string) {
  const builder = require("./build").default;

  await builder(root);
}

async function getArgs(args: string[]) {
    const argv = args ? Array.from(args) : process.argv.slice(2);
    if ((!argv[0] || argv[0][0] === "-" || fs.existsSync(argv[0]))) {
        argv.unshift("dev");
    }
    const root = path.resolve(argv[1] || ".");

    return {
        argv,
        root,
    };
}

export {
    run,
};
