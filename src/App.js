import React, { Component } from 'react'
import Files from './components/files'
import Stats from './components/stats'
import Server from './components/server_on'
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/styles/App.css'

export class App extends Component {

    constructor(props){
        super(props)
        this.handleServerChange =this.handleServerChange.bind(this)
        this.state = {
            server_on : false
        }
    }

    handleServerChange(e) {
        this.setState({server_on: e});
        //console.log(this.state.server_on)
    }

    render() {
        const server_on = this.state.server_on;
        return (
            <React.Fragment>
                {
                    server_on ?
                        <Server changeServerOn = {this.handleServerChange}/>
                    :
                        <div className='App'>
                            <Files/>
                            <Stats changeServerOn = {this.handleServerChange}/>
                        </div>
                }
            </React.Fragment>
        )
    }
}

export default App
