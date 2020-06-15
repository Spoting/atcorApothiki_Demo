import React from 'react';
import Download from '../components/excelDownload';
import GalleryWrapper from '../components/galleryWrapper';
import DataGridGen from '../components/dataGridGen';

const ApiTasks = require("../util/api").default.ApiTasks;
const ApiItems = require("../util/api").default.ApiItems;

export default class TaskMvts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "TaskItems",
            modeSubTable: "ItemMovements",
            taskItems: [],
            itemMovements: [],
            images: [],
            selectedTaskItem: -1,
            selectedAtcorId: -1,
            // selectedMovement: -1,
            of: "",
            ofTask: "",
            isLoading: false,
            taskId: -1,

            excelData: []
        }
    }
    async componentDidMount() {
        console.log("TaskId", this.props.match.params.id);
        let x = parseInt(this.props.match.params.id);
        this.setState({ taskId: x }, async () => {
            await this._getTaskItems();
           
        })
    }
    async componentDidUpdate(prevProps, prevState) {
        console.log("Prev", prevState.selectedTaskItem);
        console.log("Curr", this.state.selectedTaskItem);
        if (this.state.selectedTaskItem !== prevState.selectedTaskItem) {
            console.log("Updating Table and SubTable");
            // await this._getTaskItems();
            // await this._getInvoicesItems();
            // this.setState({})
            await this._getTaskItemMovements();
            
        }
        if (this.state.selectedAtcorId !== prevState.selectedAtcorId) {
            console.log("Updating Gallery");
            await this._getImages();
        }
    }

    setSelectedTaskItem = async (selectedTaskItem, selectedAtcorId, force) => {
        if (force) {
            this._getTaskItems();
            this._getTaskItemMovements();
        } else {
            this.setState({ selectedTaskItem: selectedTaskItem, selectedAtcorId: selectedAtcorId }, () =>
                console.log("Selected ", this.state.selectedAtcorId)
            )
        }
    }

    _getTaskItems = async () => {
        let results = await ApiTasks.getTaskItems(this.state.taskId);
        console.log("Mexxxxxxxx", results);
        if (results.err) {
            return;
        }
        let taskName = results.tasks[0].taskName;
        let sysName = results.tasks[0].sysName;
        let rows = results.tasks[0].items.map((r) => {
            let row = {};
            row.id = r.taskItems.id;
            row.atcorId = r.atcorId;
            row.atcorNo = r.atcorNo;    
            row.name = r.name;
            row.PN = r.PN;
            row.atcorPN = r.atcorPN
            row.nsn = r.nsn;
            row.totalStock = r.totalStock;
            row.totalMatOut = r.taskItems.totalMatOut;
            row.totalMatRet = r.taskItems.totalMatRet;
            row.matOut = 0;
            row.matRet = 0;
            return row;
        })
        this.setState({
            taskItems: rows,
            ofTask: sysName.concat(taskName),
            // columns: columns
        });
    }
    _getTaskItemMovements = async () => {
        let results = await ApiTasks.getTaskItemMvts(this.state.taskId, this.state.selectedTaskItem);
        if (results.err) {
            return;
        }
        // console.log("gamw to mouni", this.state.taskItems[this.state.selectedAtcorId]);

        let x = this.leftFillNum(this.state.selectedAtcorId)
        console.log("results", results);
        this.setState({
            itemMovements: results,
            // of: this.state.selectedAtcorId
            of: x
        });
    }
    _getImages = async () => {
        console.log(this.state.selectedAtcorId)
        let res = await ApiItems.getImages(this.state.selectedAtcorId);
        let sources = res.data.map((i) => {
            let img = '';
            img = 'http://localhost:8000/static/' + i;
            // img.width = 100;
            // img.height = 100;

            return img;
        });
        // console.log("Srcs", sources);
        this.setState({ images: sources })
    }

    leftFillNum = (num, targetLength)  => {
        return num.toString().padStart(6, 0);
    }

    //Function to be passed to Excel Component. Gets Requested Data from DB. Returns array of objects.
    _dataForExcel = async () => {
        let data = []; 

        await Promise.all(this.state.taskItems.map( async i =>  {
            console.log("Iterable Item", i);
            let itemMvts = await ApiTasks.getTaskItemMvts(this.state.taskId, i.atcorId);
            console.log(itemMvts);
            let itemObject = { i, itemMvts};
            data.push(itemObject);
        }))
        console.log("Final Data to be given to excel", data);
        this.setState({ excelData: data}, () => console.log( "to mouni tis manas sou", this.state.excelData));
        return data;
     }

    render() {
        return (
            <div className="" style={{ height: "500px", paddingLeft: "50px", minWidth: "1300px", paddingTop: "60px" }}>
                <h1>Task Movements</h1>
                <div className="row">
                    <div className="col-lg-9" >
                        <DataGridGen
                            mode={this.state.mode}
                            data={this.state.taskItems}
                            selectedRow={this.state.selectedTaskItem}
                            setSelectedRow={this.setSelectedTaskItem}
                            enableCellSelect={true}
                            taskId={this.state.taskId}
                            of={this.state.ofTask}
                        />
                        <div style={{ marginTop: '15px' }}>
                            <DataGridGen
                                mode={this.state.modeSubTable}
                                data={this.state.itemMovements}
                                // selectedRow={this.state.selectedTaskItem}
                                // setSelectedRow={this.setSelectedTaskItem}
                                enableCellSelect={false}
                                taskId={this.state.taskId}
                                of={this.state.of}
                            />
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <GalleryWrapper images={this.state.images} />
                    </div>
                </div>
                <Download data={this.state.excelData} dlData={this._dataForExcel}>Peos</Download>
                
            </div>
        );
    }
}

