import React from 'react';


const ApiItems = require("../util/api").default.ApiItems;

export default class ImgUpload extends React.Component {
    //File Uploading
    constructor(props) {
        super(props);
        this.state = {
            files: []
        }
    }

    _onFormSubmit = async (e) => {
        e.preventDefault();
        console.log("OnSumbit", this.state.files);
        if (this.props.images.length > 0) {
            alert("Item already got Images.")
            return;
        }
        if (this.props.selectedAtcorId <= 0) {
            alert("Please select an Item");
            return;
        }
        if (this.state.files.length > 3) {
            // this.setState({files: null});
            alert("Choose maximun 3 files")
            return;
        }
        if (this.state.files.length === 0) {
            alert("Choose Images to Upload")
            return;
        }
        let response = await ApiItems.postImages(this.props.selectedAtcorId, this.state.files);
        alert(response.msg);
        document.getElementById('input-imgs').value = null;
        this.props.refreshImgs() //
        console.log("END OF FORMSUMBIT");

    }
    _onChange = (e) => {
        this.setState({ files: e.target.files }, () =>
            console.log("OnChange", this.state.files)
        )
    }


    leftFillNum = (num, targetLength) => {
        if (num === null) {
            return
        }
        return num.toString().padStart(6, 0);
    }

    render() {
        let x = "NoSelectedItem";
        if (this.props.selectedAtcorId > 0) {
            x = this.leftFillNum(this.props.selectedAtcorId);
        }
        return (
            <div>
                <span style={{ fontSize: "35px", fontWeight: "500", width: "50%" }}>File Upload</span>
                <form onSubmit={this._onFormSubmit} style={{ marginTop: "12px", float: "right", marginRight: "22%", width: "50%" }}>
                    <input id="input-imgs" type="file" multiple accept=".jpg,.jpeg,.png" onChange={this._onChange} />
                    <button type="submit">Upload Images for {x}</button>
                </form>
            </div>
        )
    }
}