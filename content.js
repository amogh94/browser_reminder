let box = $("<div></div>").html("").css("font-size","30px").css("color","white").css("position","fixed")
.css("left","10%").css("min-height","20%").css("text-align","center").css("top","20%")
.css("border","2px solid black").css("background","blue").css("padding","20px");
chrome.runtime.onMessage.addListener((properties)=>{
	box.html(properties.message);
	let html = $("body").html();
	$("body").html("");
	box.appendTo("body");
	setTimeout(()=>{
		box.remove();
		$("body").html(html);
	},properties.duration*60*1000);
});