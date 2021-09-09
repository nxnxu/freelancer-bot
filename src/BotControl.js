import React, {useEffect, useRef, useState} from "react";
import './BotControl.css'
import JobAdd from "./JobAdd";
import * as timeago from "timeago.js";


function BotControl(props) {

    const [controls, setControls] = useState({
        job: props.job,
        refreshTime: props.settings.refreshTime,
        autoRefresh: 0,
    });

    const get = (time) => {
        if (time === null) {
            time = "Not Refreshed";
        } else {
            time = timeago.format(time);
        }
        return time;
    }

    const [lastrefresh, setLastrefresh] = useState(get(props.lastrefresh));

    React.useEffect(() => {
        console.log('set time');
        const interval = setInterval(() => {
            setLastrefresh(get(props.lastrefresh));
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [props.lastrefresh]); // has no dependency - this will be called on-component-mount


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
                    </div>
                    <div className='bot-control-status-values'>
                        <div> {props.status.total} </div>
                        <div className='success-color'> {props.status.success} </div>
                        <div className='error-color'> {props.status.failed} </div>
                        <div> {props.status.projectCount} </div>
                    </div>
                </div>
                <div className='bot-control-auto-refresh'>
                    <input type="number" name="refresh-time" onChange={onRefreshTime} value={controls.refreshTime}/>
                    <div>
                        <input type="checkbox" name="auto-refresh" id='auto-refresh' onClick={onAutoRefresh}/>
                        <label htmlFor="auto-refresh">Auto Refresh</label>
                    </div>
                </div>
                <div className='refresh-section'>
                    <div className='refresh-button'>
                        <button onClick={onRefresh}>Refresh</button>
                    </div>
                    <div className='refresh-status'>
                        Last Refresh: {lastrefresh}
                    </div>
                </div>
            </div>
            <div className={'bot-jobs'}>
                <div className='bot-control-jobs'>
                    {jobs}
                </div>
                <div>
                    <JobAdd jobs={props.allJobs} onAdd={props.onAdd}/>
                </div>
            </div>
        </div>
    );
}

export default BotControl;