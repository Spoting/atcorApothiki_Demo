import React from 'react';
// import Gallery from "react-photo-gallery";

export default class GalleryWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
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
    }
    render() {
        return (
            <div className={"imageGallery"} >
                {this.props.images.map(image => (
                    <div className={"frame"} style={{ margin: "auto" }}>
                        <img style={{ width: "100%", height: "100%" }} src={image.src} ></img>
                    </div>
                ))}

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