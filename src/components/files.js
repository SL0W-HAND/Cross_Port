import React, { Component } from 'react';
import './styles/files.css';
import add_file_icon from './assets/file-plus.svg';
import minus_file_icon from './assets/file-minus.svg';
import pdfIcon from './assets/pdf.svg';
import videoIcon from './assets/film.svg';
import imageIcon from './assets/image.svg';
import musicIcon from './assets/headphones.svg';
import defaultIcon from './assets/file-text.svg';

const electron = window.require('electron');

export class files extends Component {

    constructor(props){
        super(props);
        this.onOpen = this.onOpen.bind(this);
        this.reset = this.reset.bind(this);
        this.deleate = this.deleate.bind(this);
        this.state = {
            name:[]
        };
        
    };

    componentDidMount(){
        electron.ipcRenderer.send('get-files');
        this.listen();
      };
  
      listen = async () => {

          electron.ipcRenderer.on('return-name',(e, arg) => {
              this.setState({
                  name : arg
              });    
          });
      };
  
      onOpen(){
          electron.ipcRenderer.send('open-dialog');
      };

      reset(){
        this.setState({
            name : []
        });
        electron.ipcRenderer.send('update-files',[]);
      };

      deleate = (file) => {
          var counter = 0;
          var arr = this.state.name;
          arr.map((register) => {
              if(file.name === register.name){
                  arr.splice(counter,1);
                  electron.ipcRenderer.send('update-files',arr);
              }else{
                  counter++;
              };
          });
          this.setState({name:arr});
      };

      renderSwitch(param) {
        switch(param) {
            case '.pdf':
                return pdfIcon;
            case '.mp4':
                return videoIcon;
            case '.mp3':
                return musicIcon;    
            case '.png':
                return imageIcon;
            case '.jpg':
                return imageIcon;    
            default:
                return defaultIcon;
        };
      };
 

    render() {
        return (
            <div className='file-component'>

                <div className='button_container'>
                    <button className='buttons add' onClick={this.onOpen}>Add files <img src={add_file_icon} alt='add file'/></button>
                    <button className='buttons reset ' onClick={this.reset}>Restart files <img src={minus_file_icon} alt='reset'/></button>
                </div>    
                <div className='file-container'>
                    {this.state.name.map((doc,i) =>
                        <div className='card mb-3 file-card'>
                            <div className='file-info'>
                                <figure>
                                    <img className='card_image' alt='file extension' src={this.renderSwitch(doc.extension)}/>
                                </figure>
                                <span key={i} className='file-name'> {doc.name}</span>
                            </div> 
                            <button className='deleate-button' onClick={() => this.deleate(doc)}>X</button>
                        </div>        
                    )}
                </div>
            </div>
        )
    }
}

export default files
