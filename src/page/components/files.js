import React, { Component } from 'react'

const electron = window.require('electron');

export class files extends Component {

    constructor(props){
        super(props);
        this.onOpen = this.onOpen.bind(this);
        this.state = {
            name:[]
        }
        
    }

    componentDidMount(){
        this.listen()
      }
  
      listen = async () => {
          
  
          electron.ipcRenderer.on('return-name',(e, arg) => {
              
              this.setState({
                  name : arg
              })    
          })
      }
  
      onOpen(){
          electron.ipcRenderer.send('open-dialog')
      };


    render() {
        return (
            <div className='file-component'>

                <div className='container'>

                    <button className='btn btn-primary ' onClick={this.onOpen}>add files <i></i></button>
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
