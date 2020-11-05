import React, { Component } from 'react'
import Files from './components/files'

export class page extends Component {

    constructor(props){
        super(props)
        this.handleServerChange =this.handleServerChange.bind(this)
        this.state = {
            server_on : false
        }
    }

    handleServerChange(e) {
        this.setState({server_on: e});
        console.log(this.state.server_on)
    }

    render() {
        const server_on = this.state.server_on;
        return (
            <React.Fragment>
                <Files/>
            </React.Fragment>
        )
    }
}

export default page

