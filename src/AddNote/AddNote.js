
/*******************
 * 
 *      This component renders when an addNote button is clicked.
 * 
 *      Renders a form for adding anew note with a title textbox, dropdonw menu
 *      for folder, and a description text box.
 * 
 * 
 * 
 */



import React, { Component } from "react";
import './AddNote.css'
import ApiContext from "../ApiContext";





class AddNote extends Component {

    // sets context
    static contextType = ApiContext;

    // sets empty state 
    state = {
        name: "",
        folderId: "",
        content: "",
        modified: "",
        // null error message will change if there is problem with API call
        error: null
    };




    // event handlers 
    handleChangeName = (event) => {
        this.setState({ name: event.currentTarget.value });
    };
    handleChangeContent = (event) => {
        this.setState({ content: event.currentTarget.value });
    };

    handleNoteSubmit = (event) => {
        event.preventDefault();
        let newNote = {
            name: this.state.name,
            modified: new Date(),
            folderId: event.currentTarget.querySelector("select").value,
            content: this.state.content,
        };


        // API POST request to our local host
        fetch("http://localhost:9090/notes", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(newNote),
        })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText)
                }
                return response.json()
            })
            .then((data) => {
                this.context.addNote(data);
                this.props.history.push(`/note/${data.id}`);
            })
            // if issue with API call error message set in state
            .catch(err => this.setState({ error: err.message }));
    };

    //***********Validators for Note title and note content******* */
    validateName() {
        // trim method removes whitespacwe
        const name = this.state.name.trim();
        if (name.length === 0) {
            return "name is required";
        }
    }
    validateContent() {
        const content = this.state.content
        if (content.length === 0) {
            return "content is required"
        }
    }


    render() {
        // maps through all current folders for slect folder drop box
        const folderOptions = this.context.folders.map((folder) => {
            return (
                <option key={folder.id} value={folder.id}>
                    {folder.name}
                </option>
            );
        });

        // If there is an error it will display in place of submit button
        let errorMessage = null;
        if (this.state.error) {
            errorMessage = <p className='error-message'>{this.state.error}</p>
        }

        // returns from below in JSX 
        return (
            <div>
                <form
                    className="addNoteForm"
                    onSubmit={(event) => this.handleNoteSubmit(event)}
                >
                    <label htmlFor="name">Note Title: </label>
                    <input
                        type="text"
                        name="folderName"
                        id="name"
                        onChange={(event) => this.handleChangeName(event)}
                        required
                    />
                    <label htmlFor="selectFolder">Select Folder:</label>

                    <select className="selectFolder">{folderOptions}</select>

                    <label htmlFor="note"> Note Content: </label>
                    <textarea
                        id="note"
                        required
                        onChange={(event) => this.handleChangeContent(event)}
                    />
                    {/** IF any validators return a value, submit button replaced by errorMessage */}
                    <input type="submit" disabled={this.validateName() || this.validateContent()} />
                    {errorMessage}
                </form>
            </div>
        );
    }
}

export default AddNote;