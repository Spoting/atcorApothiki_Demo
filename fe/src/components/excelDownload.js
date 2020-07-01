import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


const dataSet1 = [
    {
        name: "Johson",
        amount: 30000,
        sex: 'M',
        is_married: true
    },
    {
        name: "Monika",
        amount: 355000,
        sex: 'F',
        is_married: false
    },
    {
        name: "John",
        amount: 250000,
        sex: 'M',
        is_married: false
    },
    {
        name: "Josef",
        amount: 450500,
        sex: 'M',
        is_married: true
    }
];


//Mock
export default class Download extends React.Component {

    async componentDidUpdate(prevProps, prevState) {
        if (this.props.data !== prevProps.data) {
            console.log("Excel data", this.props.data);
            console.log("Excel function", this.props.dlData);
        }
    }

    render() {
        console.log("Mesa stin malakia tou excel", this.props.data);

        let excelButton;

        if (this.props.data.length == 0) {  //If Data is empty, prepare data
            excelButton = <button onClick={this.props.dlData} > Prepare Excel </button>;
        } else {                            // Else Create download link
            excelButton = <button onClick={() => console.log("Psema", this.props.data)} > Download Excel </button>;
        }
        return (
            <div>
                {excelButton}

                {/* Testing Excel */}
                <ExcelFile element={<button color={'yellow'}>Excel</button>} filename={"Peos"}>
                    <ExcelSheet data={dataSet1} name="Employees">
                        <ExcelColumn label="Name" value="name" />
                        <ExcelColumn label="Wallet Money" value="amount" />
                        <ExcelColumn label="Gender" value="sex" />
                        <ExcelColumn label="Marital Status"
                            value={(col) => col.is_married ? "Married" : "Single"} />
                    </ExcelSheet>
                </ExcelFile>
            </div>
        );

    }
}



{/* < ExcelFile >
            <ExcelSheet data={null} name="Employees">
                <ExcelColumn label="Name" value="name" />
                <ExcelColumn label="Wallet Money" value="amount" />
                <ExcelColumn label="Gender" value="sex" />
                <ExcelColumn label="Marital Status"
                    value={(col) => col.is_married ? "Married" : "Single"} />
            </ExcelSheet>
            <ExcelSheet data={null} name="Leaves">
                <ExcelColumn label="Name" value="name" />
                <ExcelColumn label="Total Leaves" value="total" />
                <ExcelColumn label="Remaining Leaves" value="remaining" />
            </ExcelSheet>
                </ExcelFile > */}
