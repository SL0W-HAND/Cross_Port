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
        const privateIp = this.state.privateIp
        const publicIp = this.state.publicIp
        //quiza aga otro componente
        return (
            <React.Fragment>
            {
                loading ?
               <Loader  server={this.changeServerState} isloading={this.changeloading}/>
            : <div className='server'>
                
            <p>el server esta encendido publica:{publicIp} privada {privateIp}</p>
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
