import React, { Component } from 'react';
// import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
// import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import XLSX from 'xlsx';
import { SheetJSFT } from './types';

// const make_cols = refstr => {
// 	let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
// 	for(var i = 0; i < C; ++i) o[i] = {name:XLSX.utils.encode_col(i), key:i}
// 	return o;
// }; 

const excelName = "tet.ods";
class ExcelReader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: {},
            data: [],
            cols: []
        }
        this.handleFile = this.handleFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {

        const files = e.target.files;

        if (files[0].name !== excelName) { //.ods to .xlsx or w/e
            alert("Wrong Excel")
            return;
        }
        if (files && files[0]) this.setState({ file: files[0] });
    };


    handleFile() {
        if (this.state.file.name) {
            /* Boilerplate to set up FileReader */
            const reader = new FileReader();
            const rABS = !!reader.readAsBinaryString;
            reader.onload = (e) => {
                /* Parse data */
                const bstr = e.target.result;

                const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_json(ws);
                this.props.cb(data);
                /* Update state */
                //   this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
                //     console.log(JSON.stringify(this.state.data, null, 2));
                //   });
            };

            if (rABS) {
                reader.readAsBinaryString(this.state.file);
            } else {
                reader.readAsArrayBuffer(this.state.file);
            };

        } else {
            alert("Upload Excel First")
        }
    }

    render() {
        return (
            <div className='container-fluid' >
                <div className='row'>
                    <div className='col-2'>
                        <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-2'>
                        <input type='submit'
                            value={"Add InvoiceItems for Invoice: " + this.props.invoice}
                            onClick={this.handleFile} />
                    </div>
                </div>
            </div>
        )
    }
}

export default ExcelReader;