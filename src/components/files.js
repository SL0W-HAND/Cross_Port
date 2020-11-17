import React, { Component } from 'react'
import './styles/files.css';
import add_file_icon from './assets/file-plus.svg';
import minus_file_icon from './assets/file-minus.svg';
import archive from './assets/archive.svg'

const electron = window.require('electron');

export class files extends Component {

    constructor(props){
        super(props);
        this.onOpen = this.onOpen.bind(this);
        this.reset = this.reset.bind(this);
        this.deleate = this.deleate.bind(this)
        this.state = {
            name:[]
        }
        
    };

    componentDidMount(){
        electron.ipcRenderer.send('get-files')
        this.listen()
      };
  
      listen = async () => {

          electron.ipcRenderer.on('return-name',(e, arg) => {
              console.log(arg)
              this.setState({
                  name : arg
              })    
          })
      };
  
      onOpen(){
          electron.ipcRenderer.send('open-dialog')
      };

      reset(){
        
        this.setState({
            name : []
        })
        electron.ipcRenderer.send('update-files',[])
      };

      deleate = (file) => {
          var counter = 0;
          var arr = this.state.name;
          arr.map((register) => {
              if(file.name === register.name){
                  arr.splice(counter,1)
                  
                  electron.ipcRenderer.send('update-files',arr);
              }else{
                  counter++;
              }
          })
          this.setState({name:arr})
          
          
      }
 

    render() {
        return (
            <div className='file-component'>

                <div className='button_container'>
                    <button className='buttons add' onClick={this.onOpen}>add files <img src={add_file_icon} alt='add file'/></button>
                    <button className='buttons reset ' onClick={this.reset}>Restrt files <img src={minus_file_icon}/></button>
                </div>    
                <div className='file-container'>
                    {this.state.name.map((doc,i) =>
                        <div className='card row mb-3 '>
                            <figure>
                                <img className='card_image' src={archive}/>
                            </figure>
                            <p key={i} className='files card-text'> {doc.name}</p>
                            <button className='cardbutton btn btn-danger' onClick={() => this.deleate(doc)}>X</button>
                        </div>        
                    )}
                </div>
            </div>
        )
    }
}

export default files
