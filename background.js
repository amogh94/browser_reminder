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

async function getIntervalProperties(){
    let intervalProperties;
    try{
        let fresult = await new Promise((resolve,reject)=>{
            chrome.storage.sync.get(localStorageKey,fetchedResult=>{resolve(fetchedResult);});
        });
        fresult = fresult[localStorageKey];
        if(!fresult || Object.keys(fresult).length==0){
            intervalProperties = defaultProperties;
        }else{
            intervalProperties = fresult;
        } 
    }catch(e){
        intervalProperties = defaultProperties;

    }
    intervalProperties.blankAfter = parseFloat(intervalProperties.blankAfter);
    intervalProperties.duration = parseFloat(intervalProperties.duration);
    return intervalProperties;
}

chrome.windows.onCreated.addListener( async ()=>{
    let intervalProperties = await getIntervalProperties();
    
    setInterval(()=>{
        chrome.tabs.query({},(tabs)=>{
            for(const tab of tabs){
                chrome.tabs.sendMessage(tab.id,intervalProperties);
            }
        });
    },(intervalProperties.blankAfter+intervalProperties.duration)*60*1000);
});