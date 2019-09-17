import Core from "./Core";

abstract class Service {
    public options?: any;
    public context?: Core;

    private optionsKey: string;

    constructor(context: any) {
        this.context = context;
        this.optionsKey = this.optionsKey || this.constructor.name;
        this.options = context.options.get(this.optionsKey);
    }

    public abstract async init(): Promise<void>;

    public abstract async start(): Promise<void>;

    public abstract async stop(): Promise<void>;
}

export default Service;
