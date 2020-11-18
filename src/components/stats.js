import React, { Component } from 'react'
import './styles/stats.css'
import wifi_icon from './assets/wifi.svg'
import wifi_off_icon from './assets/wifi-off.svg'

const electron = window.require('electron');

export class stats extends Component {
    constructor(props){
        super(props)
        this.handleOnClick = this.handleOnClick.bind(this)
        this.checkConection = this.checkConection.bind(this)
        this.state = {
            networkName:[],
        }
    };

    componentDidMount(){
        electron.ipcRenderer.send('network_name_req')
        this.listen()
    };
    
    listen = async () => {
        electron.ipcRenderer.on('network_name_response',(e,arg) => {
            if (arg === false) {
                this.setState({
                    networkName: false
                });
            } else {
                this.setState({
                    networkName : arg
                });  
            };
            
        });
    };

    handleOnClick(){
         this.props.changeServerOn(true);        
         //electron.ipcRenderer.send('burn-baby',ff);     
    };

    checkConection(){
        electron.ipcRenderer.send('network_name_req');
        this.listen();
    }

    render() {
        //const temperature = this.props.server_on;
        const networkName = this.state.networkName
        return (
           
                <div className='stats_container'>
                    
                        <div className='network_name'>
                            <figure>
                                <img 
                                    className='wifi-icon' 
                                    src={networkName
                                        ? wifi_icon
                                        : wifi_off_icon}
                                    alt='wifi icon'/>  
                            </figure>
                            <span>{networkName 
                            ? networkName 
                            : 'conection error'}
                            </span>
                        </div>
                        <div className='button_on'>
                            {networkName
                            ?<button className='server-button' onClick={this.handleOnClick}>
                            Turn on
                        </button>
                        :<button className='server-button' onClick={this.checkConection}>Retry</button>
                            }
                            
                        
                        </div>
                    
                </div>      
        );
    };
};

export default stats
