interface Config {
	api: {
		baseUrl: string;
	};
}

export function getConfig(): Config {
	return {
		api: {
			baseUrl: 'http://localhost:3000',
		},
	};
}
