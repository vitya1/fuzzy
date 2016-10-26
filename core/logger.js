class Logger {

	constructor() {
		this.messages = [];
	}

	/**
	 * Will be redeclare
	 * @param message
	 */
	addCallback(message) {
		console.log(message.text);
	}

	add(text) {
		let message = {
			timestamp: Date.now(),
			text: text
		};
		this.messages.push(message);

		if(this.addCallback) {
			this.addCallback(message);
		}
	}

	getFull() {
		return this.messages;
	}

}

export default Logger;