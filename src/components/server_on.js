import React, { Component } from 'react'
import './styles/server-on.css'

const electron = window.require('electron');

export class server_on extends Component {
    constructor(props){
        super(props)
        this.handlechanges = this.handlechanges.bind(this)
    }

    //checar la coneccion aqui y retornar al levantar estado 
    componentDidMount(){
        electron.ipcRenderer.send('network_name_req')
        this.listen()
    }

    listen = async () => {
        electron.ipcRenderer.on('network_name_response',(e,arg) => {
            
            if (arg === false) {
                this.props.changeServerOn(false); 
            } 
            //esto de abajo hace un loop raro
            /*else {
               // this.props.changeServerOn(true);  
               console.log('gcgh')
            };
            */
            
        });
    };

    handlechanges(){
        this.props.changeServerOn(false)
    }

    render() {
        return (
            <div className='server'>
                
                <p>el server esta encendido</p>
                <div className='info'>
                    <button className='btn btn-danger' onClick={this.handlechanges}>apagar</button>
                </div>
                
            </div>
        )
    }
}

export default server_on
