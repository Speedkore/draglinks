var initY=0;
var initX=0;
var settings = {}
var span;


document.addEventListener("dragstart", (e) => {
    if (e.button==0){
        initY = e.screenY;
        initX = e.screenX;
        if (e.target.nodeName && e.target.nodeName=="#text" ||
            e.target.tagName && e.target.tagName.toLowerCase()=='input'&& e.target.type === "text") {
            load_settings();
            span = document.createElement("span");
            span.style.cssText = "position:fixed;top:0px;left:0px;z-index: 99999999;font-size: 10px;font-weight: bold;background-color:#ffffff;color:black;";
            document.body.appendChild(span);
        }
    }
});

document.addEventListener("dragover", (e) => {
   // console.log(e.clientX, e.screenX);
    if (e.button==0){
        if (span){
        var dir = direction_UDRL(initX, initY, e.screenX, e.screenY)
        if (dir == "up") span.textContent = settings.drag_text_up;
        if (dir == "down") span.textContent = settings.drag_text_down;
        if (dir == "left") span.textContent = settings.drag_text_left;
        if (dir == "right") span.textContent = settings.drag_text_right;
        }

    }
});

document.addEventListener("dragend", (e) => {
   // console.log(e.clientX, e.screenX);
    // DRAG INSIDE WINDOW CHECK / There isn't a trusty way to check drag inside viewport
    if (span) span.remove();
 //   if (e.screenX < window.screenX) return;
  //  if (e.screenY < window.screenY) return;
///    https://bugzilla.mozilla.org/show_bug.cgi?id=505521
    //outerwidth and outerheight fail giving the correct pixels amount
    //if (e.screenX > window.screenX + window.outerWidth) return;
    //if (e.screenY > window.screenY + window.outerHeight) return;
    
    
    // LEFT MOUSE BUTTON
    if (e.button==0){
        // SELECTED TEXT DRAGGED
        if (e.target.nodeName && e.target.nodeName=="#text"){
            var text = window.getSelection().toString();
            browser.runtime.sendMessage({"type": "text",  "initX": initX, "initY": initY, "screenX": e.screenX, "screenY": e.screenY, "text": text});
        }
        // LINK DRAGGED
        if (e.target.tagName && e.target.tagName.toLowerCase()=='a') {
            browser.runtime.sendMessage({"type": "link",  "initX": initX, "initY": initY, "screenX": e.screenX, "screenY": e.screenY, "url": e.target.href});
        }
        // INPUT BOX SELECTED TEXT DRAGGED
        if (e.target.tagName && e.target.tagName.toLowerCase()=='input'&& e.target.type === "text") {
            var text = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd);
            browser.runtime.sendMessage({"type": "text",  "initX": initX, "initY": initY, "screenX": e.screenX, "screenY": e.screenY, "text": text});
        }

    }
});

function load_settings() {
    browser.storage.local.get().then( function(item){
            settings.drag_text_up = get_domain(item.drag_text_up);
            settings.drag_text_down = get_domain(item.drag_text_down);
            settings.drag_text_right = get_domain(item.drag_text_right);
            settings.drag_text_left = get_domain(item.drag_text_left);
    }, function(error){console.log(error);})
}

// helper tools
function direction_UDRL(initX, initY, screenX, screenY) {
    deltaX = screenX-initX
    deltaY = screenY-initY
    if (Math.abs(deltaX) > Math.abs(deltaY)){
        return((deltaX>0) ?  "right" : "left");
    }else{
        return((deltaY>0) ?  "down" : "up");
    }
}

function get_domain(url){
    var hostname;

     if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    return hostname;
}
