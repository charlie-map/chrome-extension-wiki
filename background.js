browser.runtime.onInstalled.addListener(() => {
	browser.storage.sync.set({ "response_data": 0 });
	browser.storage.sync.set({ "curr_backend_url": "https://cutewiki.charlie.city/" });
	
	browser.storage.sync.set({ "curr_tab": null });
});

function check_url_change() {
	console.log("url change");
	browser.tabs.query({ active: true, lastFocusedWindow: true }, tab => {

		browser.storage.sync.set({ curr_tab: tab[0].url });
	});
}

browser.tabs.onActivated.addListener(check_url_change);
browser.tabs.onUpdated.addListener(check_url_change);