import React from "react";

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: false,
            interval: null,
        };
    }

    handleClick = () => {
        const nw = {...this.state};
        nw.status = !nw.status;
        if (!nw.status) {
            clearInterval(nw.interval);
            nw.interval = null;
        } else {
            nw.interval = setInterval(() => {console.log('interval')}, 1000);
        }
        this.setState(nw);
    }

    render() {
        return (
            <div>
                <button onClick={this.handleClick}>{this.state.status?'Stop': 'Start'}</button>
            </div>
        );
    }
}


export default Timer;