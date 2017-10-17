var settings = {};

browser.runtime.onMessage.addListener(handle_message);
browser.storage.onChanged.addListener(changed_settings);


function handle_message(message) {

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

        browser.tabs.create({
            active: openbackground,
            url: message.url
        });
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
            browser.tabs.create({
                active: !openbackground,
                url: url
            });
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

// options page load
assign_settings_to_variables();
function changed_settings() {assign_settings_to_variables();}
function assign_settings_to_variables(){
    browser.storage.local.get().then( function(item){
        if (!item.drag_text_settings) { 
            //set default values when there are not settings defined
            var duck =  "https://duckduckgo.com/?q={%text%}"
            var google = "https://www.google.com/search?q={%text%}"
            browser.storage.local.set({ drag_text_settings: true,
                                        drag_text_up: google, drag_text_down: duck, drag_text_left: "", drag_text_right: "",
                                        drag_text_upName: "Google", drag_text_downName: "DuckDuckGo", drag_text_leftName: "", drag_text_rightName: "",
                                        drag_text_bup: false, drag_text_bdown: false, drag_text_bleft: false, drag_text_bright: false});
        }else{
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
        }
    }, function(error){console.log(error);})
}
