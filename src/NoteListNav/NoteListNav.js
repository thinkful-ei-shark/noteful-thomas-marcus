import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddFolder from "../AddFolder/AddFolder";
import CircleButton from "../CircleButton/CircleButton";
import ApiContext from "../ApiContext";
import { countNotesForFolder } from "../notes-helpers";
import "./NoteListNav.css";




class NoteListNav extends React.Component {
  state = {
    adding: false,
  };
  static contextType = ApiContext;

  addFolderHandler = () => {
    console.log("notelist nav state before: ", this.state)
    this.setState({ adding: !this.state.adding })
    this.forceUpdate()
    console.log("notelist nave state: ", this.state);
  };

  render() {
    const { folders = [], notes = [] } = this.context;
    return (
      <div className="NoteListNav">
        <ul className="NoteListNav__list">
          {folders.map((folder) => (
            <li key={folder.id}>
              <NavLink
                className="NoteListNav__folder-link"
                to={`/folder/${folder.id}`}
              >
                <span className="NoteListNav__num-notes">
                  {countNotesForFolder(notes, folder.id)}
                </span>
                {folder.name}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="NoteListNav__button-wrapper">
          <CircleButton
            type="button"
            className="NoteListNav__add-folder-button"
            onClick={() => this.addFolderHandler()}
          >
            <FontAwesomeIcon icon="plus" />
            <br />
            Folder
          </CircleButton>
          {this.state.adding && <AddFolder handleAdding={this.addFolderHandler} />}
        </div>
      </div>
    );
  }
}

export default NoteListNav