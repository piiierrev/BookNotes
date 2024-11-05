function createNote(title, authorName, coverId, bookKey) {
    const noteElement = `
    <div id=modal-overlay>
        <div id="modal-createNote"> 
            <h1>Title: ${title}</h1> 
            <h2>Author: ${authorName}</h2> 
            <form id="noteForm">
                <textarea name="note" id="noteText" autofocus placeholder="Write your note here"></textarea>
                <button type="button" onclick="saveNote('${title}', '${authorName}', '${coverId}', '${bookKey}')">Save note</button>
            </form>
            <button type="button" onclick="cancelNote()">Cancel</button>
        </div>
    </div>`;

    document.getElementById("dashboard-body").innerHTML += noteElement;
}

//function save a new Note
async function saveNote(title, authorName, coverId, bookKey) {
    const note = document.getElementById("noteText").value;
console.log("hello note :" + note)


    try {
        // Send the request using Fetch API
        const response = await fetch('/createNote', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title : title,
                authorName: authorName,
                coverId: coverId,
                bookKey: bookKey,
                note: note})
        });

         // Check response status OK (status 200)
        if (response.ok) {
        console.log('Note successfully created!');
        cancelNote()
        
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    } catch (error) {
        console.error('Error:', error);
        // Gérer l'erreur, par exemple afficher un message d'erreur dans l'interface utilisateur
    }
}



function cancelNote() {
    const modal = document.getElementById("modal-overlay");
    
    if (modal) {
        modal.remove();  // Removes the element from the DOM
    }
}