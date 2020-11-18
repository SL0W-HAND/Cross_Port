import React, { Component } from 'react'
import './styles/loader.css'
const electron = window.require('electron');

export class loading extends Component {
    constructor(props){
        super(props)
        this.getIpAdrerss = this.getIpAdrerss.bind(this)
    }
    
    componentDidMount(){
         
        electron.ipcRenderer.send('ip_adress_req')
        this.getIpAdrerss()

    }

    getIpAdrerss = async () => {
        electron.ipcRenderer.on('ip_adress_res',(e,arg) => {
            if( arg.privateIP === false){
                this.props.server(false)
            }else{
                console.log(arg)
                
                this.props.isloading(arg,false)
               // this.props.publicAdress = arg.publicIp
            }
        })
    }
    render() {
        
        //mandar a preguntar por conexxion 
        return (
            <div class="loader-container">
                <div class="lds"><div></div><div></div><div></div></div>
            </div>
        )
    }
}

export default loading

