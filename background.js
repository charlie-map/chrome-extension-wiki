chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ "documents_read": 0 });
	chrome.storage.sync.set({ "document_votes": 0 });
	chrome.storage.sync.set({ "response_data": 0 });
	chrome.storage.sync.set({ "curr_backend_url": "localhost:4224" });
});