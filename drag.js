var startY=0;
var startX=0;
var endY=0;
var endX=0;
var settings = {}
var span;


document.addEventListener("dragstart", (e) => {
    if (e.button==0){
        startY = e.screenY;
        startX = e.screenX;
        //console.log("init", e.screenY, e.clientY,e);
        if (e.target.nodeName && e.target.nodeName=="#text" ||
            e.target.tagName && e.target.tagName.toLowerCase()=='input'&& e.target.type === "text") {
            load_settings();
            span = document.createElement("span");
            span.style.cssText = "position:fixed;top:0px;left:0px;z-index: 99999999;font-size: 20px;font-weight: bold;background-color:#ffffff;color:grey;";
            document.body.appendChild(span);
        }
    }
});

document.addEventListener("dragover", (e) => {
    if (e.button==0){
        // console.log("end", e.screenY, e.clientY,e);
        endY = e.screenY;
        endX = e.screenX;
        if (span){
        var dir = direction_UDRL(startX, startY,endX, endY)
        if (dir == "up") span.textContent = settings.drag_text_upName;
        if (dir == "down") span.textContent = settings.drag_text_downName;
        if (dir == "left") span.textContent = settings.drag_text_leftName;
        if (dir == "right") span.textContent = settings.drag_text_rightName;
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
        //console.log("end", e.screenY, e.clientY,e);
        if (e.target.nodeName && e.target.nodeName=="#text"){
            var text = window.getSelection().toString();
            browser.runtime.sendMessage({"type": "text",  "startX": startX, "startY": startY, "endX": endX, "endY": endY, "text": text});
        }
        // LINK DRAGGED
        if (e.target.tagName && e.target.tagName.toLowerCase()=='a') {
            browser.runtime.sendMessage({"type": "link",  "startX": startX, "startY": startY, "endX": endX, "endY": endY, "url": e.target.href});
        }
        // INPUT BOX SELECTED TEXT DRAGGED
        if (e.target.tagName && e.target.tagName.toLowerCase()=='input'&& e.target.type === "text") {
            var text = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd);
            browser.runtime.sendMessage({"type": "text",  "startX": startX, "startY": startY, "endX": endX, "endY": endY, "text": text});
        }
        // IMAGE DRAGGED
        if (e.target.tagName && e.target.tagName.toLowerCase()=='img') {
            browser.runtime.sendMessage({"type": "link",  "startX": startX, "startY": startY, "endX": endX, "endY": endY, "url": e.target.src});
        }

    }
});

function load_settings() {
    browser.storage.local.get().then( function(item){
            settings.drag_text_upName = item.drag_text_upName;
            settings.drag_text_downName = item.drag_text_downName;
            settings.drag_text_rightName = item.drag_text_rightName;
            settings.drag_text_leftName = item.drag_text_leftName;
    }, function(error){console.log(error);})
}

// helper tools
function direction_UDRL(startX, startY, endX, endY) {
    deltaX = endX-startX
    deltaY = endY-startY
    if (Math.abs(deltaX) > Math.abs(deltaY)){
        return((deltaX>0) ?  "right" : "left");
    }else{
        return((deltaY>0) ?  "down" : "up");
    }
}


