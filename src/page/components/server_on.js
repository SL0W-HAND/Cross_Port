import React, { Component } from 'react'

export class server_on extends Component {
    constructor(props){
        super(props)
        this.handlechanges = this.handlechanges.bind(this)
    }

    handlechanges(){
        this.props.changeServerOn(false)
    }
    render() {
        return (
            <div>
                <p>el server esta encendido</p>
                <button className='btn btn-danger' onClick={this.handlechanges}>apagar</button>
            </div>
        )
    }
}

export default server_on
