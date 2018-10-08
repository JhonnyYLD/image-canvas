import React, { Component } from 'react';
import './App.css';


class ImageCanvas extends Component {

  componentDidMount() {
    this.updateCanvas();
  }
  updateCanvas() {
    let image = this.props.img;
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    let imageData = this.filterImage(this.grayScale, image, null);
    imageData ? ctx.putImageData(imageData, 0, 0) : ctx.drawImage(image, 0, 0);
    // ctx.drawImage(this.props.img,0,0);

  }
  grayScale(pixels, args) {
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      pixels[i] = pixels[i + 1] = pixels[i + 2] = v;
    }
    return pixels;
  }
  filterPipeline(pixels, filters) {

  }
  filterImage(filter, image, var_args) {
    const imageData = this.getPixels(image);
    if (imageData !== 0) filter(imageData.data, var_args);
    return imageData;
  }

  getPixels(image) {
    let canvas = this.newCanvas(image.width, image.height);
    let ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    if (!this.isContextTainted(ctx))
      return ctx.getImageData(0, 0, canvas.width, canvas.height);
    else
      return 0

  }
  isContextTainted(ctx) {
    try {
      ctx.getImageData(0, 0, 1, 1);
      return false;
    } catch (err) {
      return (err.code === 18);
    }
  }
  newCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  render() {
    return (
      <canvas
        className='ImageCanvas'
        ref='canvas'
        width={this.props.img.width}
        height={this.props.img.height}
      >

      </canvas>
    )
  }
}

class VideoCanvas extends Component {

  componentDidMount() {
    console.log(this.props.video)
    const canvas = this.refs.canvas;
    console.log(this.props.video.videoHeight, this.props.video.videoWidth)
  
    console.log(canvas);
    requestAnimationFrame(this.updateCanvas.bind(this))
    // this.updateCanvas();
  }
  updateCanvas() {
    let image = this.props.video;
    const canvas = this.refs.canvas;
    canvas.height = this.props.video.videoHeight
    canvas.width = this.props.video.videoWidth
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    requestAnimationFrame(this.updateCanvas.bind(this))

  }

  render() {
    return (
      <canvas
        className='ImageCanvas'
        ref='canvas'
        // width={this.props.video.videoWidth}
        // height={this.props.video.videoHeight}
      >

      </canvas>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      imgSrc: '/images/pexels-photo-374815.jpeg',
      loaded: false,
      videoLoaded: false
    }
  }

  componentDidMount() {
    const img = new Image()
    img.src = this.state.imgSrc;
    img.onload = () => {
      this.setState({
        img,
        loaded: true
      })
    }
    const constraints = {
      video: true
    };

    const video = this.refs.video;

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream
        this.setState({
          video,
          videoLoaded: true
        })
      });


  }

  hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  render() {
    return (
      <div className="App">
        <video
          className='ImageCanvas'
          ref='video'
          autoPlay></video>
        {
          this.state.videoLoaded &&
          <VideoCanvas
            video={this.state.video}
          />
        }
        {
          this.state.loaded &&
          <ImageCanvas
            img={this.state.img}
          />
        }

        <input
          type='range'
          min='0'
          max='255'
        />
      </div>
    );
  }
}

export default App;
