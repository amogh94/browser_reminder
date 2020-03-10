chrome.windows.onCreated.addListener(()=>{
	setInterval(()=>{
		chrome.tabs.query({},(tabs)=>{
			for(const tab of tabs){
				chrome.tabs.sendMessage(tab.id,'');
			}
		});
	},20000);
});