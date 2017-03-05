type Handlers = Array<(...data: any[]) => void>;
type Channel = { [key: string]: Handlers };

export class Events {

	private static _channel: Channel = {};

	private static _referenceCount: number = 0;

	private static _instance: Events;

	private constructor() { }

	static getInstance(): Events {
		Events._referenceCount++;
		console.log(Events._referenceCount);
		if (!Events._instance) {
			Events._instance = new Events();
		}
		return Events._instance;
	}

	public subscribe(key: string, action: (...data: any[]) => void) {
		if (!Events._channel[key]) {
			Events._channel[key] = [action];
			return;
		}
		Events._channel[key].push(action);
	}

	public publish(channelKey: string, ...data: any[]): void {
		let handlers = Events._channel[channelKey];
		if (!handlers) {
			return
		}
		if (handlers.length) {
			handlers.forEach(handler => handler(...data));
		}
	}

	public unsubscribe(key: string): boolean {
		let handlers = Events._channel[key];
		if (!handlers) {
			return false;
		}
		delete Events._channel[key];
		return true;
	}
}