var isConnected = false;
var selected_db = null;
var selected_collection = null;
var conn_button = document.getElementById('conn-button');
var modal = document.getElementById("connectModal");

// On click Result and Query buttons
const btn_result = document.getElementById("button-result");
const btn_query = document.getElementById("button-mongo-query");

// Easy-MQL query converter
function convert() {
    // Ajax http request
    httpRequest = new XMLHttpRequest();
    editor1_body = editor1.getValue();
    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 ) {
            if (this.status == 200) {
                editor2.session.setMode("ace/mode/json");
                let response = JSON.parse(this.responseText);
                // add event listener for result button
                btn_result.addEventListener('click', () => {
                    editor2.setValue(JSON.stringify(response.result, null, 4));
                    editor2.clearSelection();
                    btn_result.style.cssText = 'background-color: seagreen;';
                    btn_query.style.cssText = 'background-color: darkseagreen;';
                });
                // add event listener for query button
                btn_query.addEventListener('click', () => {
                    editor2.setValue(JSON.stringify(response.query, null, 4));
                    editor2.clearSelection();
                    btn_query.style.cssText = 'background-color: seagreen;';
                    btn_result.style.cssText = 'background-color: darkseagreen;';
                });
                // set response from server to editor2
                editor2.setValue(JSON.stringify(response.result, null, 4));
                editor2.clearSelection();
                isIndented = true;
                btn_result.style.cssText = 'background-color: seagreen;';
                btn_query.style.cssText = 'background-color: darkseagreen;';
                indent_editor2_btn.style.cssText = 'color: #f7f7f7; background-color: #393e46;';
            } else {
                // if query is wrong change editor to python and set the value
                btn_result.style.cssText = 'background-color: seagreen;';
                btn_query.style.cssText = 'background-color: darkseagreen;';
                editor2.session.setMode("ace/mode/python");
                editor2.setValue(this.responseText);
                editor2.clearSelection();
            }
        }
    }
    httpRequest.open('GET', `/dbs/${selected_db}/collections/${selected_collection}/docs?query=${encodeURIComponent(editor1_body)}`);
    httpRequest.send();
}

conn_button.addEventListener('click', () => {
    if (isConnected) {
        // DISCONNECT
        isConnected = false;

        // set button state to connect
        conn_button.innerText = 'Connect';
        conn_button.classList.remove('disconn-button');

        // clear the db and coll dropdown list empty
        let emptyMenuItem = '<button class="dropdown-item">Empty</button>';
        document.getElementById('db-dropdown-menu').innerHTML = emptyMenuItem;
        document.getElementById('db-dropdown-button').innerText = 'Db';
        document.getElementById('coll-dropdown-menu').innerHTML = emptyMenuItem;
        document.getElementById('coll-dropdown-button').innerText = 'Coll';

    } else {
        // CONNECT

        // When the user clicks the button, open the modal
        modal.style.display = "block";

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }
    }
})

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
            isConnected = true;

            // change the state of button to disconnected
            conn_button.innerText = 'Disconnect';
            conn_button.classList.add('disconn-button');

            // closes the pop up window after the connection to db
            modal.style.display = "none";
            array = JSON.parse(this.responseText)

            var newHTML = [];
            for (var i = 0; i < array.length; i++) {
                newHTML.push('<button class="dropdown-item" onClick="select_dbs(event)">' + array[i] + '</button>');
            }
            document.getElementById('db-dropdown-menu').innerHTML = newHTML.join('');
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


function select_dbs(event) {
    selected_db = event.target.innerText;
    document.getElementById('db-dropdown-button').innerText = selected_db;
    collectionHttpRequest = new XMLHttpRequest();
    collectionHttpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200 ) {
            collectionsArray = JSON.parse(this.responseText);
            var newHTMLs = [];
            for (var i = 0; i < collectionsArray.length; i++) {
                newHTMLs.push('<button class="dropdown-item" onClick="select_collection(event)">' + collectionsArray[i] + '</button>');
            }
            document.getElementById('coll-dropdown-menu').innerHTML = newHTMLs.join('');
        }
    }
    collectionHttpRequest.open('GET', '/dbs/'+selected_db+'/collections');
    collectionHttpRequest.send();
}

function select_collection(event) {
    selected_collection = event.target.innerText;
    document.getElementById('coll-dropdown-button').innerText = selected_collection;
    documentsHttpRequest = new XMLHttpRequest();
    documentsHttpRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200 ) {
            let response = JSON.parse(this.responseText);
            editor2.setValue(JSON.stringify(response.result, null, 4));
            editor2.clearSelection();
            isIndented = true;
            btn_result.style.cssText = 'background-color: seagreen;';
            btn_query.style.cssText = 'background-color: darkseagreen;';
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
        }
    }
    dbDisconnectHttpRequest.open('POST', '/disconnect');
    dbDisconnectHttpRequest.send();
}

let run_button = document.getElementById("run-button");

run_button.addEventListener('click', () => {
    if (!isConnected) {
        alert('Please connect to server');
        return;
    } else if (!selected_db) {
        alert('Please select a database');
        return;
    } else if (!selected_collection) {
        alert('Please select a collection');
        return;
    }
    
    // Ajax http request
    httpRequest = new XMLHttpRequest();
    editor1_body = editor1.getValue();
    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4 ) {
            setTimeout(5000);
            
            if (this.status == 200) {
                editor2.session.setMode("ace/mode/json");
                let response = JSON.parse(this.responseText);
                // add event listener for result button
                btn_result.addEventListener('click', () => {
                    editor2.setValue(JSON.stringify(response.result, null, 4));
                    editor2.clearSelection();
                    btn_result.style.cssText = 'background-color: seagreen;';
                    btn_query.style.cssText = 'background-color: darkseagreen;';
                });
                // add event listener for query button
                btn_query.addEventListener('click', () => {
                    editor2.setValue(JSON.stringify(response.query, null, 4));
                    editor2.clearSelection();
                    btn_query.style.cssText = 'background-color: seagreen;';
                    btn_result.style.cssText = 'background-color: darkseagreen;';
                });
                // set response from server to editor2
                editor2.setValue(JSON.stringify(response.result, null, 4));
                editor2.clearSelection();
                isIndented = true;
                btn_result.style.cssText = 'background-color: seagreen;';
                btn_query.style.cssText = 'background-color: darkseagreen;';
                indent_editor2_btn.style.cssText = 'color: #f7f7f7; background-color: #393e46;';
            } else {
                // if query is wrong change editor to python and set the value
                btn_result.style.cssText = 'background-color: darkseagreen;';
                btn_query.style.cssText = 'background-color: darkseagreen;';
                editor2.session.setMode("ace/mode/python");
                editor2.setValue(this.responseText);
                editor2.clearSelection();
            }
        }
    }
    httpRequest.open('GET', `/dbs/${selected_db}/collections/${selected_collection}/docs?query=${encodeURIComponent(editor1_body)}`);
    httpRequest.send();
});
