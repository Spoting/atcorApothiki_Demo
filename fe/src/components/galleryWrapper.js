import React from 'react';
// import Gallery from "react-photo-gallery";
import { render } from 'react-dom';
import ImageViewer from 'react-simple-image-viewer';

export default class GalleryWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            currentImage: 0,
            // setCurrentImage: 0,
            isViewerOpen: false,
            // setIsViewerOpen: false,
        };
    }

    async componentDidMount() {
        this.setState({ images: this.props.images });
    }

    async shouldComponentUpdate(nextProps) {
        // console.log(this.props.images);
        // console.log(nextProps.images);
        if (this.props.images !== nextProps.images) {
            console.log("Gallery Updated");
            this.setState({ images: nextProps.images });
        }
        console.log("8ee mou", this.state.images);
    }

    openImageViewer =  (index) => {
        console.log("IMAGES", this.state.images);
        console.log("Peoutsini", index)
        this.setState({ currentImage: index, isViewerOpen: true })
    }

    closeImageViewer = async () => {
        this.setState({ isViewerOpen: false, currentImage: 0 })
    }
    // openImageViewer = useCallback((index) => {
    //     setCurrentImage(index);
    //     setIsViewerOpen(true);
    //   }, []);

    // closeImageViewer = () => {
    //     setCurrentImage(0);
    //     setIsViewerOpen(false);
    //   };

    render() {
        return (
            <div className={"imageGallery"} >
                {this.state.images.map((image, index) => (
                    <div className={"frame"} style={{ margin: "auto" }}>
                        <img
                            style={{ width: "100%", height: "100%" }}
                            // style={{ width: "100px", height: "100px" }}
                            src={image}
                            key={index}
                            onClick={() => this.openImageViewer(index)}></img>
                    </div>
                ))}
                {this.state.isViewerOpen && (
                    <ImageViewer
                        src={this.props.images}
                        currentIndex={this.state.currentImage}
                        onClose={()=> this.closeImageViewer()}
                    />
                )}
               
            </div >

        )



        // <Gallery
        //     photos={this.state.images}
        //     columns={1}
        //     direction={this.state.images.length > 0 ? 'column' : 'row'}
        //     // direction='row'
        // />

    }
}