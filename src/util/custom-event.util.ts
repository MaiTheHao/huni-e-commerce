export const dispatchAuthEvent = (eventName: string, data?: any) => {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new CustomEvent(`${eventName}`, { detail: data }));
	}
};
