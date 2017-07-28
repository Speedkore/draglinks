inputs = document.querySelectorAll("input");
for (i = 0; i < inputs.length; ++i) {
    inputs[i].addEventListener("change", save_options);
}
document.addEventListener('DOMContentLoaded', restore_options);

 
function save_options(e) {
    browser.storage.local.set({
    drag_text_up: document.querySelector("#up").value,
    drag_text_down: document.querySelector("#down").value,
    drag_text_left: document.querySelector("#left").value,
    drag_text_right: document.querySelector("#right").value,
    drag_text_bup: document.querySelector('#bup').checked,
    drag_text_bdown: document.querySelector('#bdown').checked,
    drag_text_bleft: document.querySelector('#bleft').checked,
    drag_text_bright: document.querySelector('#bright').checked,
    drag_link_LR: document.querySelector('#drag_link_LR').checked,
    drag_link_swap: document.querySelector('#drag_link_swap').checked,
     });
    e.preventDefault();
}

function restore_options(e) {
    browser.storage.local.get().then( function(item){
             document.querySelector("#up").value = item.drag_text_up;
             document.querySelector("#down").value = item.drag_text_down;
             document.querySelector("#right").value = item.drag_text_right;
             document.querySelector("#left").value = item.drag_text_left;
             document.querySelector("#bup").checked = item.drag_text_bup;
             document.querySelector("#bdown").checked = item.drag_text_bdown;
             document.querySelector("#bleft").checked = item.drag_text_bleft;
             document.querySelector("#bright").checked = item.drag_text_bright;
             document.querySelector("#drag_link_LR").checked = item.drag_link_LR;
             document.querySelector("#drag_link_swap").checked = item.drag_link_swap;
    }, function(error){console.log(error);})
}
