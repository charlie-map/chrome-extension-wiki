chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ "response_data": 0 });
	chrome.storage.sync.set({ "curr_backend_url": "https://cutewiki.charlie.city/" });
	
	chrome.storage.sync.set({ "curr_tab": null });
});

function check_url_change() {
	chrome.tabs.query({ active: true, lastFocusedWindow: true }, tab => {

		chrome.storage.sync.set({ curr_tab: tab[0].url });
	});
}

chrome.tabs.onActivated.addListener(check_url_change);
chrome.tabs.onUpdated.addListener(check_url_change);