var initY=0;
var initX=0;

document.addEventListener("dragstart", (e) => {
    if (e.button==0){
        initY = e.screenY;
        initX = e.screenX;
    }
});

document.addEventListener("dragend", (e) => {
    // DRAG INSIDE WINDOW CHECK / There isn't a trusty way to check drag inside viewport
    if (e.screenX < window.screenX) return;
    if (e.screenY < window.screenY) return;
    if (e.screenX > window.screenX + window.outerWidth) return;
    if (e.screenY > window.screenY + window.outerHeight) return;

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

