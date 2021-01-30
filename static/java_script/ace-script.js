var isIndented = false;

//----------------------- Editor 1 section -----------------------//
var editor1 = ace.edit("editor1", {
    fontFamily: 'Fira Mono',
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
    fontFamily: 'Fira Mono',
    fontSize: '10pt',
    theme: "ace/theme/tomorrow",
    mode: "ace/mode/json",
    setShowPrintMargin: false,

});

// Clears the editor2 screen
const clearBtnEditor2 = document.getElementById("button-clear-editor2");

clearBtnEditor2.addEventListener('click', () => {
    // clear's the editor2
    editor2.setValue('');
    document.querySelector('#indent-button-editor2').style.cssText = 'background-color: #eeeeee; color: #393e46;';
    isIndented = false;
});

// function to indent editor2
function indent2() {
    if (isIndented) {
        editor2.setValue(JSON.stringify(JSON.parse(editor2.getValue())));
        isIndented = false;
        document.querySelector('#indent-button-editor2').style.cssText = 'background-color: #eeeeee; color: #393e46;';
    } else {
        editor2.setValue(JSON.stringify(JSON.parse(editor2.getValue()), null, 4));
        isIndented = true;
        document.querySelector('#indent-button-editor2').style.cssText = 'background-color: #393e46; color: #f7f7f7;';
    }
}


// function to convert to json
function convert() {
    // check for minimum two character available
    if (editor1.getValue().length >= 2) {
        // Ajax http request
        httpRequest = new XMLHttpRequest();
        editor1_body = editor1.getValue();
        httpRequest.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                editor2.setValue(JSON.stringify(JSON.parse(this.responseText), null, 4));
                isIndented = true;
                document.querySelector('#indent-button-editor2').style.cssText = 'background-color: #393e46; color: #f7f7f7;';
            }
        }
        httpRequest.open('POST', '/convert');
        httpRequest.send(editor1_body);
    } else {
        editor2.setValue("Nothing to convert");
    }
}
