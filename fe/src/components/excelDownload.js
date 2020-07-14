import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class Download extends React.Component {

    async componentDidUpdate(prevProps, prevState) {
        if (this.props.data !== prevProps.data) {
            console.log("Excel data", this.props.data);
            console.log("Excel function", this.props.dlData);
        }
    }

    render() {
        let excelButton;
        if (this.props.data.length == 0) {  //If Data is empty, prepare data
            excelButton = <button onClick={this.props.dlData} > Prepare Excel </button>;
        } else {                            // Else Create download link
            excelButton =
                <ExcelFile element={<button color={'yellow'}>Excel</button>} filename={this.props.ofTask}>
                    {this.props.data.map(im => {
                        return (<ExcelSheet data={im.itemMvts} name={im.i.atcorNo + "_" + im.i.name}>
                            <ExcelColumn label="Date" value="matActionDate" />
                            <ExcelColumn label="MatOut" value="matOut" />
                            <ExcelColumn label="MatRet" value="matRet" />
                        </ExcelSheet>)
                    })}
                </ExcelFile>;
        }
        return (
            <div>
                {excelButton}
            </div>
        );

    }
}