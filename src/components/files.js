import React, { Component } from 'react'
import './styles/files.css';
import add_file_icon from './assets/file-plus.svg';
import minus_file_icon from './assets/file-minus.svg'

const electron = window.require('electron');

export class files extends Component {

    constructor(props){
        super(props);
        this.onOpen = this.onOpen.bind(this);
        this.reset = this.reset.bind(this);
        this.state = {
            name:[]
        }
        
    };

    componentDidMount(){
        this.listen()
      };
  
      listen = async () => {
          
  
          electron.ipcRenderer.on('return-name',(e, arg) => {
              
              this.setState({
                  name : arg
              })    
          })
      };
  
      onOpen(){
          electron.ipcRenderer.send('open-dialog')
      };

      reset(){
        electron.ipcRenderer.send('reset-files')
        this.setState({
            name : []
        })
      };


    render() {
        return (
            <div className='file-component'>

                <div className='button_container'>
                    <button className='btn btn-primary ' onClick={this.onOpen}>add files <img src={add_file_icon}/></button>
                    <button className='btn btn-danger restart ' onClick={this.reset}>Restrt files <img src={minus_file_icon}/></button>
                </div>    
                <div className='file-container'>
                    {this.state.name.map((doc,i) =>
                        <div className='card mb-3'>
                            <div className='row no-gutters'>
                                <div className='col-md-4'>
                                    <i className='card-img'></i>
                                </div>
                                <div className='col-md-8'>
                                    <div className='card-body'>
                                        <p key={i} className='files card-text'> {doc.name}</p>
                                    </div>
                                </div>                    
                            </div>
                        </div>        
                    )}
                </div>
            </div>
        )
    }
}

export default files
