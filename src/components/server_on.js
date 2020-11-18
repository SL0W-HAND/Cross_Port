import React, { Component } from 'react'
import './styles/server-on.css'
import Loader from './loading'

const electron = window.require('electron');

export class server_on extends Component {
    constructor(props){
        super(props)
        this.handlechanges = this.handlechanges.bind(this)
        this.changeloading = this.changeloading.bind(this)
        this.changeServerState = this.changeServerState.bind(this)
        this.state = {
            loading: true,
            publicIp: false,
            privateIp: false,
            
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
        electron.ipcRenderer.send('turn-off-server')
    }

    changeServerState(e){
        if(e === false){
            this.props.changeServerOn(false)
        }
    }

    changeloading(data,load){
        
        this.setState({
            loading: load,
            publicIp: data.publicIp,
            privateIp: data.privateIp,
        })
        if (load === false) {
                electron.ipcRenderer.send('burn-baby')
            
        }
    }

    

    render() {
        const loading = this.state.loading //esta se esta comparano no lo borres
        const privateIpAdress = String(this.state.privateIp)+':8989'
       const publicIpAdress = String(this.state.publicIp)+':8989'
        var QRCode = require('qrcode.react');
        //quiza aga otro componente
        return (
            <React.Fragment>
            { loading ?
                <Loader  server={this.changeServerState} isloading={this.changeloading}/>
            : 
                <div className='server'> 
                    <span className='info'>The server is runing</span>
                    <div className='qr_container'>
                        <div className='private_adress'>
                            <span>In your local network</span>
                            <QRCode value={privateIpAdress}/>
                            <span>{privateIpAdress}</span>
                        </div>
                        <div className='public_adress'>
                            <span>On internet</span>
                            <QRCode value={publicIpAdress}/>
                            <span>{publicIpAdress}</span>
                        </div>
                    </div>
                    <button className='turn-off-button' onClick={this.handlechanges}>Turn off</button>
                    
                </div>
            }
            </React.Fragment>
        )
    }
}

export default server_on