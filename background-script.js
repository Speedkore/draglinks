var settings = {};
browser.runtime.onMessage.addListener(handle_message);
browser.storage.onChanged.addListener(changed_settings);


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
        settings.drag_text_up =         (typeof item.drag_text_up != 'undefined') ? item.drag_text_up : ""
        settings.drag_text_down =       (typeof item.drag_text_down != 'undefined') ? item.drag_text_down : ""
        settings.drag_text_right =      (typeof item.drag_text_right != 'undefined') ? item.drag_text_right : ""
        settings.drag_text_left =       (typeof item.drag_text_left != 'undefined') ? item.drag_text_left : ""
        settings.drag_text_bup =        (typeof item.drag_text_bup != 'undefined') ? item.drag_text_bup : false
        settings.drag_text_bdown =      (typeof item.drag_text_bdown != 'undefined') ? item.drag_text_bdown : false
        settings.drag_text_bleft =      (typeof item.drag_text_bleft != 'undefined') ? item.drag_text_bleft : false
        settings.drag_text_bright =     (typeof item.drag_text_bright != 'undefined') ? item.drag_text_bright : false
        settings.drag_link_LR =         (typeof item.drag_link_LR != 'undefined') ? item.drag_link_LR : false
        settings.drag_link_swap =       (typeof item.drag_link_swap != 'undefined') ? item.drag_link_swap : false
        settings.open_next_to_current = (typeof item.open_next_to_current != 'undefined') ? item.open_next_to_current : false

    }, function(error){console.log(error);})
}
