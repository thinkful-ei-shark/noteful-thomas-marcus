import React, { Component } from "react";
import ApiContext from "../ApiContext";
import './AddFolder.css'




class AddFolder extends Component {
    // sets context
    static contextType = ApiContext;

    state = {
        id: ' ',
        name: ' ',
        // error message default null... will only change if probelm with POST request
        error: null
    };


    // event handlers
    handleChange = (error) => {
        this.setState({ name: error.currentTarget.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        let newName = this.state.name;
        let newFolder = {
            name: newName,
        };
        fetch("http://localhost:9090/folders", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(newFolder),
        })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json()
            })
            .then((data) => {
                this.context.addFolder(data);
            })
            .catch(err => this.setState({ error: err.message }));
    };

    // name of folder validator
    validateName() {
        // trim method removes whitespace
        const name = this.state.name.trim();
        if (name.length === 0) {
            return "name is required";
        }
    }

    render() {
        let errorMessage = null;
        if (this.state.error) {
            errorMessage = <p className='error-message'>{this.state.error}</p>
        }

        return (
            <div>
                <form
                    className="addFolderForm"
                    onSubmit={(event) => this.handleSubmit(event)}
                >
                    <label htmlFor="folderName">Name: </label>
                    <input
                        type="text"
                        name="folderName"
                        id="folderName"
                        onChange={(event) => this.handleChange(event)}
                        required
                    />
                    {/**IF there is an error button will be replaced by error message */}
                    <input type="submit" disabled={this.validateName()} />
                    {errorMessage}
                </form>
            </div>
        );
    }
}

export default AddFolder