if(typeof $ != "undefined"){
	let properties = {};
	let port = chrome.runtime.connect({name: 'reminderAppPort'});
	function makeUpdate(){
		chrome.runtime.sendMessage({task: "store", data: properties});
	};

	chrome.runtime.sendMessage({task: "fetch"}, (fetchedData)=>{
		properties = fetchedData;
		$("#n_sec").val(properties.blankAfter);
		$("#m_sec").val(properties.duration);
		$("#msg").val(properties.message);
	});

	$("#n_sec").on("change",e=>{
		let value = $(e.target).val();
		if(value){
			properties.blankAfter = value;
			makeUpdate();
		}
	});
	$("#m_sec").on("change",e=>{
		let value = $(e.target).val();
		if(value){
			properties.duration = value;
			makeUpdate();
		}
	});
	$("#msg").on("blur",e=>{
		let value = $(e.target).val();
		if(value){
			properties.message = value;
			makeUpdate();
		}
	});
}