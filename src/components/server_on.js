import React, { Component } from 'react'
import './styles/server-on.css'
import Loader from './loading'

const electron = window.require('electron');

export class server_on extends Component {
    constructor(props){
        super(props)
        this.handlechanges = this.handlechanges.bind(this)
        this.changeloading = this.changeloading.bind(this)
        this.state = {
            loading: true,
            publicIp: false,
            privateIp: false,
            on: true
        }
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

    changeloading(e){
        this.setState({loading: e})
    }

    render() {
        const loading = this.state.loading
        const privateip = this.state.privateIp
        const publicip = this.state.publicIp
        const on = this.state.on
        return (
            <React.Fragment>
            {
                loading ?
               <Loader  isloading={this.changeloading}/>
            : <div className='server'>
                
            <p>el server esta encendido</p>
            <div className='info'>
                <button className='btn btn-danger' onClick={this.handlechanges}>apagar</button>
            </div>
            
        </div>
            }
            </React.Fragment>
        )
    }
}

export default server_on
