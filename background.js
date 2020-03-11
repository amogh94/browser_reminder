const localStorageKey = "reminderApp";
let fetched = {};
let stored = {};
let properties = {};

let defaultProperties = {
    blankAfter: 30,
    duration: 2,
    message: "Please drink water"
};

chrome.runtime.onConnect.addListener(function (externalPort) {

    chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
        if(request.task=="fetch"){
            chrome.storage.sync.get(localStorageKey,result=>{
                let response = result[localStorageKey];
                if(!response || !Object.keys(response).length){
                    response = defaultProperties;
                }
                properties = response;
                fetched = response;
                sendResponse(response);
            });
            
        }else if(request.task=="store"){
            stored[localStorageKey] = request.data;
            properties = request.data;
            sendResponse();
        }else{
            sendResponse();
        }
        return true;
    });


    externalPort.onDisconnect.addListener(function() {
        chrome.storage.sync.set(stored);
    });
});

chrome.windows.onCreated.addListener(()=>{
    let intervalProperties = properties;
    if(Object.keys(properties).length==0){
        intervalProperties = defaultProperties;
    }else{
        intervalProperties = properties;
    }
    setInterval(()=>{
        if(Object.keys(properties).length==0){
            intervalProperties = defaultProperties;
        }else{
            intervalProperties = properties;
        }
        chrome.tabs.query({},(tabs)=>{
            for(const tab of tabs){
                chrome.tabs.sendMessage(tab.id,intervalProperties);
            }
        });
    },(intervalProperties.blankAfter+intervalProperties.duration)*60*1000);
});