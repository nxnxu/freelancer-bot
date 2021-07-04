import React, {useState} from "react";
import './BotControl.css'

function BotControl(props) {

    const [controls, setControls] = useState({
        job: props.job,
        refreshTime: props.settings.refreshTime,
        autoRefresh: 0,
    });

    const onAutoRefresh = e => {
        // console.log('Refresh', e.target.checked);
        const nc = Object.assign({}, controls);
        nc.autoRefresh = e.target.checked;
        setControls(nc);
        props.onControlChange(Object.assign({refresh: 0}, nc));
    };

    const onRefreshTime = e => {
        // console.log('Refresh Time:', e.target.value);
        const nc = Object.assign({}, controls);
        nc.refreshTime = Number(e.target.value);
        setControls(nc);
        props.onControlChange(Object.assign({refresh: 0}, nc));
    };

    const onJobSelect = e => {
        // console.log('Job Select:', e.target.value);
        const nc = Object.assign({}, controls);
        nc.job = Number(e.target.value);
        setControls(nc);
        props.onControlChange(Object.assign({refresh: 0}, nc));
    };

    const onRefresh = e => {
        const nc = Object.assign({refresh: 1}, controls);
        props.onControlChange(nc);
    };

    // job controls
    const jobs = props.jobs.map(job => {
        return (
            <div key={job.id} className='bot-control-job'>
                <input onClick={onJobSelect} type="radio" id={'job' + job.id} name='job' value={job.id} defaultChecked={props.job === job.id}/>
                <label htmlFor={'job' + job.id}>{job.name}</label>
            </div>
        );
    });

    return (
        <div className='bot-control'>
            <div className='bot-control-panel'>
                <div className='bot-control-status'>
                    <div className='bot-control-status-labels'>
                        <div> Total Request: </div>
                        <div> Success Request:</div>
                        <div> Failed Request: </div>
                        <div> Project Count: </div>
                        <div> Project Hidden: </div>
                    </div>
                    <div className='bot-control-status-values'>
                        <div> {props.status.total} </div>
                        <div className='success-color'> {props.status.success} </div>
                        <div className='error-color'> {props.status.failed} </div>
                        <div> {props.status.projectCount} </div>
                        <div> {props.status.hiddenCount} </div>
                        {/*<div> Total Request: {props.status.total} </div>*/}
                        {/*<div> Success Request: {props.status.success} </div>*/}
                        {/*<div> Failed Request: {props.status.failed} </div>*/}
                    </div>
                </div>
                <div className='bot-control-auto-refresh'>
                    <input type="number" name="refresh-time" onChange={onRefreshTime} value={controls.refreshTime}/>
                    <div>
                        <input type="checkbox" name="auto-refresh" id='auto-refresh' onClick={onAutoRefresh}/>
                        <label htmlFor="auto-refresh">Auto Refresh</label>
                    </div>
                </div>
                <div >
                    <button onClick={onRefresh}>Refresh</button>
                </div>
            </div>
            <div className='bot-control-jobs'>
                {jobs}
            </div>
        </div>
    );
}

export default BotControl;