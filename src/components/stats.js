import React, { Component } from 'react'

const electron = window.require('electron');

const ff = 33;

export class stats extends Component {
    constructor(props){
        super(props)
        this.handleOnClick = this.handleOnClick.bind(this)
        this.state = {
            networkName:{},
        }
    }

    componentDidMount(){
        //electron.ipcRenderer.send('network_name_req')
        this.listen()
    }
    
    listen = async () => {
        electron.ipcRenderer.on('network_name',(e,arg) => {
            this.setState({
                networkName : arg
            })
    
            console.log(this.state.networkName)
        })
    }

    handleOnClick(){
    
        this.props.changeServerOn(true)
        //electron.ipcRenderer.send('burn-baby',ff); 
    
    }
    render() {
        const temperature = this.props.server_on;
        return (
           
                <div className='stats_container'>
                    <div className='network_name'>
                    </div>
                    <div className='button_on'>
                        <button className='btn btn-danger' onClick={this.handleOnClick}>
                            server
                        </button>
                    </div>
                    
                </div>
                
          
           
        )
    }
}

export default stats
