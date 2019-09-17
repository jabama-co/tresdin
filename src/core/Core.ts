import fs from "fs";

import Config from "./Config";
import { importModule } from "./imports";
import Model from "./Model";
import Service from "./Service";

export default class Core {
    public plugins: Array<() => void> = [];

    public services: Service[] = [];

    public options: Config = new Config({});

    public root: string = "";

    public models: Model[] = [];

    constructor(root: string, config: any) {
        this.root = root;
        this.options = new Config(config);
    }

    public resolve(path: string) {
        return path.replace("~", this.root);
    }

    public async import(path: string) {
        let file = await importModule(this.resolve(path));
        if (file.default) {
            file = file.default;
        }
        return file;
    }

    public async loadModels() {
        try {
            const models = await fs.readdirSync(this.resolve("~/models"));
            await Promise.all(models.map((c) => this.import("~/models/" + c)));
        } catch {
            // nop
        }
    }

    public async loadPlugins() {
        const pluginsList = this.options.plugins.map(async (plugin: any) => {
            const $plugin = await this.import(plugin);
            return $plugin(this, this.options);
        });
        this.plugins = await Promise.all(pluginsList);
    }

    public async loadServices() {
        const servicesList = this.options.services.map(async (service: any) => {
            const $service = await this.import(this.resolve(service));
            return new $service(this, this.options);
        });

        this.services = await Promise.all(servicesList);
    }

    public async init() {
        await this.loadModels();

        await this.loadServices();

        await this.loadPlugins();

        await Promise.all(this.services.map((service: any) => service.init(this, this.options)));
    }

    public async start() {

        await this.init();

        await Promise.all(this.services.map((service: any) => service.start(this, this.options)));
    }

    public async stop() {
        await Promise.all(this.services.map((service: any) => service.stop(this, this.options)));
    }

    public registerModel(model: Model) {
        this.models.push(model);
    }

}
