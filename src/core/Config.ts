class Config {
    [key: string]: any
    public services: string[] = [];
    public plugins: string[] = [];

    constructor(config: any) {
        const { services = [], plugins = [], ...more } = config;
        Object.assign(this, more);

        this.plugins = this.plugins.concat(plugins);
        this.services = this.services.concat(services);
    }

    public get(key: string, defaultValue: any = {}): any {
        const camelKey = this._camelize(key);
        const config: any = this[camelKey] as any;
        return config || defaultValue;
    }

    public _camelize(str: string): string {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter: string, index: number) => {
          return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, "");
    }
}

export default Config;
