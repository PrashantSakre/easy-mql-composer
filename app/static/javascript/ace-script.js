var isIndented = false;

//Set editors placeholder 
function update(editor, text) {
    var shouldShow = !editor.session.getValue().length;
    var node = editor.renderer.emptyMessageNode;
    if (!shouldShow && node) {
        editor.renderer.scroller.removeChild(editor.renderer.emptyMessageNode);
        editor.renderer.emptyMessageNode = null;
    } else if (shouldShow && !node) {
        node = editor.renderer.emptyMessageNode = document.createElement("div");
        node.textContent = text
        node.className = "ace_emptyMessage"
        node.style.padding = "0 9px"
        node.style.position = "absolute"
        node.style.zIndex = 9
        node.style.opacity = 0.5
        editor.renderer.scroller.appendChild(node);
    }
}

//----------------------- Editor 1 section -----------------------//
var editor1 = ace.edit("editor1", {
    fontFamily: 'IBM Plex Mono',
    fontSize: '10pt',
    theme: "ace/theme/tomorrow",
    mode: "ace/mode/python",
});

// add command to editor1 convert()
editor1.commands.addCommand({
    name: "convert",
    bindKey: {win: "Ctrl-enter", mac: "Command-enter"},
    exec: function() {
        convertOrCancel();
    }
});

const clearBtnEditor1 = document.getElementById("clear-button");

clearBtnEditor1.addEventListener('click', () => {
    // clear's the editor1 
    editor1.setValue('');
});

editor1.on("input", () => update(editor1, "Write your EasyMQL query here"));
setTimeout(() => update(editor1, "Write your EasyMQL query here"), 100);

//------------------------ Editor 2 section -----------------------//
var editor2 = ace.edit("editor2", {
    fontFamily: 'IBM Plex Mono',
    fontSize: '10pt',
    theme: "ace/theme/tomorrow",
    mode: "ace/mode/json",
    readOnly: true,
    highlightActiveLine: false,
    highlightGutterLine: false
});

// disable cursor in editor2
editor2.renderer.$cursorLayer.element.style.display = "none"

editor2.on("input", () => update(editor2, "Result goes here"));
setTimeout(() => update(editor2, "Result goes here"), 100);


function indent2() {
    if (isIndented) {
        editor2.setValue(JSON.stringify(JSON.parse(editor2.getValue())));
        editor2.clearSelection(); // clear's the selected text in editor
        isIndented = false;
    } else {
        editor2.setValue(JSON.stringify(JSON.parse(editor2.getValue()), null, 4));
        editor2.clearSelection();
        isIndented = true;
    }
}

$('document').ready(function(){
    $(".disconnect").addClass("disabled");
});

// Get the export-modal
var exportModal = document.getElementById("exportModal");
var exportTextarea = document.getElementById('export-textarea-content');
function export_clipboard() {
    // When the user clicks the button, open the modal
    exportModal.style.display = "block";

    // Get the <span> element that closes the modal
    let span = document.getElementById("export-close");

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      exportModal.style.display = "none";
    }

    exportTextarea.value = JSON.stringify(JSON.parse(editor2.getValue()), null, 4);
}

function copy() {
    exportTextarea.select();
    document.execCommand('copy');
}

function download_query() {
    // On click download button, download the file

    var text = document.getElementById("export-textarea-content").value;
    
    var ele = document.createElement('a');
    ele.style.display = 'none';

    ele.setAttribute('href', 'data:json/plain;charset-utf-8,' + encodeURIComponent(text));

    ele.setAttribute('download', "query.json");
    document.body.appendChild(ele);

    ele.click();
    document.body.removeChild(ele);
}
