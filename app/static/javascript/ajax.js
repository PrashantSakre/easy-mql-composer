// Easy-MQL query converter
function convert() {
    // Ajax http request
    httpRequest = new XMLHttpRequest();
    editor1_body = editor1.getValue();
    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 ) {
            if (this.status == 200) {
                editor2.session.setMode("ace/mode/json")
                editor2.setValue(JSON.stringify(JSON.parse(this.responseText), null, 4));
                isIndented = true;
                indent_editor2_btn.style.cssText = 'color: #f7f7f7; background-color: #393e46;';
            } else {
                editor2.session.setMode("ace/mode/python")
                editor2.setValue(this.responseText);
            }
        }
    }
    httpRequest.open('GET', '/dbs/'+selected_db+'/collections/'+selected_collection+'/docs?query=' + editor1_body);
    httpRequest.send();
}

// connection to the mongo
const connect_mongo = document.getElementById("connect_mongo");

connect_mongo.addEventListener('click', () => {
    $('.modal-error').html('');
    document.getElementById("loading").style.visibility = "visible";
    // Ajax http request
    mongoHttpRequest = new XMLHttpRequest();
    mongoUrl = document.getElementById('mongo-url').value;
    mongoHttpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200 ) {
            // change connect button to disabled vice-versa with disconnect button
            $(".connect").addClass("disabled");
            $(".disconnect").removeClass("disabled");
            // change the color of db-icon to lime
            document.getElementById('button-connect').style.cssText = 'color: lime;';
            console.log(JSON.stringify(JSON.parse(this.responseText), null, 4));
            // closes the pop up window after the connection to db
            modal.style.display = "none";
            array = JSON.parse(this.responseText)
            var newHTML = [];
            for (var i = 0; i < array.length; i++) {
                newHTML.push('<button class="btn-sm dropdown-item" onClick="select_dbs()">' + array[i] + '</button>');
            }
            $(".dropdown-db").html(newHTML.join(''));
            $('.modal-content button').text('Connect');
        } else if ( this.status == 500 ) {
            $('.modal-error').html('<p>Internal server error check your mongo connection</p>');
            $('.modal-content button').text('Re-connect');
            $('#loading').css("visibility",'hidden');
        }
    }
    mongoHttpRequest.open('POST', '/connect');
    mongoHttpRequest.send(mongoUrl);
});


function select_dbs() {
    selected_db = event.target.innerText;
    console.log("selected db = "+selected_db);
    document.getElementById('dropdownSelectedDbButton').innerText = selected_db;
    collectionHttpRequest = new XMLHttpRequest();
    collectionHttpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200 ) {
            collectionsArray = JSON.parse(this.responseText);
            console.log(collectionsArray);
            var newHTMLs = [];
            for (var i = 0; i < collectionsArray.length; i++) {
                newHTMLs.push('<button class="btn-sm dropdown-item" onClick="select_collection()">' + collectionsArray[i] + '</button>');
            }
            $(".dropdown-collection").html(newHTMLs.join(''));
        }
    }
    collectionHttpRequest.open('GET', '/dbs/'+selected_db+'/collections');
    collectionHttpRequest.send();
}

function select_collection() {
    selected_collection = event.target.innerText;
    console.log("selected collection = "+selected_collection);
    document.getElementById('dropdownSelectedCollectionButton').innerText = selected_collection;
    documentsHttpRequest = new XMLHttpRequest();
    documentsHttpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200 ) {
            editor2.setValue(JSON.stringify(JSON.parse(this.responseText), null, 4));
            console.log(BSON.deserialize(this.responseText));
            isIndented = true;
            indent_editor2_btn.style.cssText = 'color: #f7f7f7; background-color: #393e46;';
        }
    }
    documentsHttpRequest.open('GET', '/dbs/'+selected_db+'/collections/'+selected_collection+'/docs');
    documentsHttpRequest.send();
}

function disconnect_button() {
    document.getElementById("loading").style.visibility = "hidden";
    dbDisconnectHttpRequest = new XMLHttpRequest();
    dbDisconnectHttpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 204 ) {
            $(".connect").removeClass("disabled");
            $(".disconnect").addClass("disabled");
            $(".dropdown-collection").html('<button class="btn-sm dropdown-item">Empty</button>');
            $(".dropdown-db").html('<button class="btn-sm dropdown-item">Empty</button>');
            document.getElementById('dropdownSelectedDbButton').innerText = "Select db";
            document.getElementById('dropdownSelectedCollectionButton').innerText = "Select collection";
            document.getElementById('button-connect').style.cssText = 'color: #393e46;';
            document.querySelector('#indent-button-editor2').style.cssText = 'color: #393e46;';
            isIndented = false;
            // clear's the editor2
            editor2.setValue('');
        } else {
            console.log("Not disconnected");
        }
    }
    dbDisconnectHttpRequest.open('POST', '/disconnect');
    dbDisconnectHttpRequest.send();
}

// add command to lazy-load keybinding_menu extension
editor1.commands.addCommand({
    name: "convert",
    bindKey: {win: "Ctrl-enter", mac: "Command-enter"},
    exec: function() {
        convert();
    }
});
editor1.execCommand("convert");
