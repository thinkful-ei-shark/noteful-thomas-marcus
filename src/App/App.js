/************************************
 * 
 *  Coders: Tom W and Marcus G
 * 
 * 
 *  Final Noteful App Submission with form implementation.
 *  Add Notes and Add Fiolder feature implemented.
 *  Error Boundary Component added
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */


import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorBoundary from '../ErrorBoundary'
import AddNote from "../AddNote/AddNote";
import NoteListNav from "../NoteListNav/NoteListNav";
import NotePageNav from "../NotePageNav/NotePageNav";
import NoteListMain from "../NoteListMain/NoteListMain";
import NotePageMain from "../NotePageMain/NotePageMain";
import ApiContext from "../ApiContext";
import config from "../config";
import "./App.css";


class App extends Component {

    //sets empty state in case API fails
    state = {
        notes: [],
        folders: [],
    };



    // life cycle method where API calls take place
    componentDidMount() {
        Promise.all([
            fetch(`${config.API_ENDPOINT}/notes`),
            fetch(`${config.API_ENDPOINT}/folders`),
        ])
            .then(([notesRes, foldersRes]) => {
                if (!notesRes.ok) return notesRes.json().then((e) => Promise.reject(e));
                if (!foldersRes.ok)
                    return foldersRes.json().then((e) => Promise.reject(e));

                return Promise.all([notesRes.json(), foldersRes.json()]);
            })
            .then(([notes, folders]) => {
                this.setState({ notes, folders });
            })
            .catch((error) => {
                alert(error)
                console.error({ error });
            });
    }

    // *************** EVENT HANDLERS *****
    // using spread operators prevents mutation of state
    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter((note) => note.id !== noteId),
        });
    };

    handleAddFolder = folder => {
        console.log("folder added");
        this.setState({
            folders: [...this.state.folders, folder],
        });
    };

    handleAddNote = note => {
        this.setState({
            notes: [...this.state.notes, note],
        });
    };

    /***************** Render functions******** */
    renderNavRoutes() {
        return (
            <ErrorBoundary>
                {["/", "/folder/:folderId"].map((path) => (
                    <Route exact key={path} path={path} component={NoteListNav} />
                ))}
                <Route path="/note/:noteId" component={NotePageNav} />
                <Route path="/add-folder" component={NotePageNav} />
            </ErrorBoundary>
        );
    }

    renderMainRoutes() {
        return (
            <ErrorBoundary>
                {["/", "/folder/:folderId"].map((path) => (
                    <Route exact key={path} path={path} component={NoteListMain} />
                ))}
                <Route path="/note/:noteId" component={NotePageMain} />
                <Route path="/add-note" component={AddNote} />
            </ErrorBoundary>
        );
    }

    render() {

        // context provide passes all event handlers to child components
        const value = {
            notes: this.state.notes,
            folders: this.state.folders,
            deleteNote: this.handleDeleteNote,
            addFolder: this.handleAddFolder,
            addNote: this.handleAddNote,
        };

        // main page render return
        return (
            <ApiContext.Provider value={value}>
                <div className="App">
                    <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{" "}
                            <FontAwesomeIcon icon="check-double" />
                        </h1>
                    </header>
                    <main className="App__main">{this.renderMainRoutes()}</main>
                </div>
            </ApiContext.Provider>
        );
    }
}

export default App;