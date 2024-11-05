function seeNote(title, authorName, note) {
    const noteElement = `
    <div id=modal-overlay>
        <div id="modal-seeNote"> 
            <h1>Title: ${title}</h1> 
            <h2>Author: ${authorName}</h2> 
            <div id="noteText"> ${note}</div>
            <button type="button" onclick="document.getElementById('modal-overlay').remove()">Close</button>
        </div>
    </div>`;

    document.getElementById("dashboard-body").innerHTML += noteElement;
}

function editNote(title, authorName, note, userId, bookId){
    const noteElement = `
    <div id=modal-overlay>
        <div id="modal-createNote"> 
            <h1>Title: ${title}</h1> 
            <h2>Author: ${authorName}</h2> 
            <form id="noteForm">
                <textarea name="note" id="noteText" autofocus>${note}</textarea>
                <button type="button" onclick="sendModifiedNote('${userId}','${bookId}')">Save note</button>
            </form>
            <button type="button" onclick="document.getElementById('modal-overlay').remove()">Cancel</button>
        </div>
    </div>`;

    document.getElementById("dashboard-body").innerHTML += noteElement;
}

//function to send the modified note content
async function sendModifiedNote(userId , bookId){
    const note = document.getElementById("noteText").value;

    try {
        // Send the PUT request using Fetch API
        const response = await fetch('/editNote', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId : userId,
                bookId: bookId,
                note: note})
        });

         // Check response status OK (status 200)
        if (response.ok) {
        console.log('Note successfully updated!');
        
        document.getElementById('modal-overlay').remove() //close the modal

        window.location.href = "/dashboard/mynotes"
            
        
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    } catch (error) {
        console.error('Error:', error);
        
    }
}

//function to delete a existing note :
async function deleteNote(userId , bookId){
    
    try {
        // Send the PUT request using Fetch API
        const response = await fetch('/deleteNote', {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId : userId,
                bookId: bookId
            })
        });

         // Check response status OK (status 200)
        if (response.ok) {
        console.log('Note successfully deleted!');
        
        

        window.location.href = "/dashboard/mynotes"
            
        
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    } catch (error) {
        console.error('Error:', error);
        
    }
}


