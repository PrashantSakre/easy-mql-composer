var isIndented = false;

//----------------------- Editor 1 section -----------------------//
var editor1 = ace.edit("editor1", {
    fontFamily: 'IBM Plex Mono',
    fontSize: '10pt',
    theme: "ace/theme/tomorrow",
    mode: "ace/mode/python",
    setShowPrintMargin: false,
});
const clearBtnEditor1 = document.getElementById("button-clear-editor1");

clearBtnEditor1.addEventListener('click', () => {
    // clear's the editor1 
    editor1.setValue('');
});


//------------------------ Editor 2 section -----------------------//
var editor2 = ace.edit("editor2", {
    fontFamily: 'IBM Plex Mono',
    fontSize: '10pt',
    theme: "ace/theme/tomorrow",
    mode: "ace/mode/json",
    setShowPrintMargin: false,
    readOnly: true
});

// Clears the editor2 screen
const clearBtnEditor2 = document.getElementById("button-clear-editor2");

clearBtnEditor2.addEventListener('click', () => {
    // clear's the editor2
    editor2.setValue('');
    indent_editor2_btn.style.cssText = 'color: #393e46;';
    isIndented = false;
});

// function to indent editor2
const indent_editor2_btn = document.querySelector('#indent-button-editor2');

function indent2() {
    if (isIndented) {
        editor2.setValue(JSON.stringify(JSON.parse(editor2.getValue())));
        isIndented = false;
        indent_editor2_btn.style.cssText = 'color: #393e46;';
    } else {
        editor2.setValue(JSON.stringify(JSON.parse(editor2.getValue()), null, 4));
        isIndented = true;
        indent_editor2_btn.style.cssText = 'color: #f7f7f7; background-color: #393e46;';
    }
}




// Get the modal
var modal = document.getElementById("connectModal");

function connect_button() {
    // When the user clicks the button, open the modal
    modal.style.display = "block";

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
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
