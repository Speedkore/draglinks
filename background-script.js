var settings = {};
browser.runtime.onMessage.addListener(handle_message);
browser.storage.onChanged.addListener(changed_settings);
browser.runtime.onInstalled.addListener(default_settings);

async function handle_message(message) {

    if (message.type == "link") {
        var direction;
        if (settings.drag_link_LR) {
            direction = direction_UDRL(message.initX, 0, message.screenX, 0); // only left and right
        } else {
            direction = direction_UDRL(0, message.initY, 0, message.screenY); // only up and down
        }
        var openbackground;
        if (direction == "up")   { openbackground = false;}
        if (direction == "down") { openbackground = true;}
        if (direction == "left") { openbackground = true;}
        if (direction == "right"){ openbackground = false;}
        if (settings.drag_link_swap) {
            openbackground = !openbackground;
        }
        var current_index = await get_current_tab_id();
        if (current_index == -1 || !settings.open_next_to_current){
           browser.tabs.create({ active: openbackground, url: message.url });
        } else {
           browser.tabs.create({ active: openbackground, url: message.url, index: current_index + 1 });
        }

    }
    if (message.type == "text") {
        var direction = direction_UDRL(message.initX, message.initY, message.screenX, message.screenY);
        var url;
        var openbackground;
        if (direction == "up")   { url = settings.drag_text_up; openbackground = settings.drag_text_bup;}
        if (direction == "down") { url = settings.drag_text_down; openbackground = settings.drag_text_bdown;}
        if (direction == "left") { url = settings.drag_text_left; openbackground = settings.drag_text_bleft;}
        if (direction == "right"){ url = settings.drag_text_right; openbackground = settings.drag_text_bright;}

        if (!url.trim() == '') {
            url = url.replace('{%text%}', message.text);
            var current_index = await get_current_tab_id();
            if (current_index == -1 || !settings.open_next_to_current){
               browser.tabs.create({ active: !openbackground, url: url });
            } else {
               browser.tabs.create({ active: !openbackground, url: url, index: current_index + 1 });
            }
        }
    }

}

// helper tools
function direction_UDRL(initX, initY, screenX, screenY) {
    deltaX = screenX-initX
    deltaY = screenY-initY
    var direction;
    if (Math.abs(deltaX) > Math.abs(deltaY)){
        return((deltaX>0) ?  "right" : "left");
    }else{
        return((deltaY>0) ?  "down" : "up");
    }
}

async function get_current_tab_id() {
    result = await browser.tabs.query({active: true, currentWindow: true})
    if (result[0]){ return result[0].index;} else { return -1;}
}


// options page load
assign_settings_to_variables();
function changed_settings() {assign_settings_to_variables();}
function assign_settings_to_variables(){
    browser.storage.local.get().then( function(item){
        //assign user settings to in memory variables
        settings.drag_text_up = item.drag_text_up;
        settings.drag_text_down = item.drag_text_down;
        settings.drag_text_right = item.drag_text_right;
        settings.drag_text_left = item.drag_text_left;
        settings.drag_text_bup = item.drag_text_bup;
        settings.drag_text_bdown = item.drag_text_bdown;
        settings.drag_text_bleft = item.drag_text_bleft;
        settings.drag_text_bright = item.drag_text_bright;
        settings.drag_link_LR = item.drag_link_LR;
        settings.drag_link_swap = item.drag_link_swap;
        settings.open_next_to_current =  item.open_next_to_current;

    }, function(error){console.log(error);})
}

function default_settings(){
       browser.storage.local.get().then( function(item){
            var duck =  "https://duckduckgo.com/?q={%text%}"
            var google = "https://www.google.com/search?q={%text%}"
            browser.storage.local.set({ 
               drag_text_up: ifEmpty(item.drag_text_up, google),
               drag_text_down: ifEmpty(item.drag_text_down, duck),
               drag_text_left: ifEmpty(item.drag_text_left, ""),
               drag_text_right: ifEmpty(item.drag_text_right, ""),
               drag_text_upName:  ifEmpty(item.drag_text_upName, "Google"),
               drag_text_downName:  ifEmpty(item.drag_text_downNam, "DuckDuckGo"),
               drag_text_leftName:  ifEmpty(item.drag_text_leftName, ""),
               drag_text_rightName:  ifEmpty(item.drag_text_rightName, ""),
               drag_text_bup:  ifEmpty(item.drag_text_bup, false),
               drag_text_bdown:  ifEmpty(item.drag_text_bdown, false),
               drag_text_bleft:  ifEmpty(item.drag_text_bleft, false),
               drag_text_bright:  ifEmpty(item.drag_text_bright, false),
               drag_link_LR:  ifEmpty(item.drag_link_LR, false),
               drag_link_swap:  ifEmpty(item.drag_link_swap, false),
               open_next_to_current:  ifEmpty(item.open_next_to_current, false),
            });
            assign_settings_to_variables();
       }, function(error){console.log(error);})
}

function ifEmpty(setting, default_value){
    return (setting===undefined || setting===null || setting==='undefined')? default_value : setting;
}

