import './BotControl.css'

function BotControl(props) {
    return (
        <div>
            <div className={'bot-status'}>
                <div className={'bot-status-col0'}>
                    <div>Total Request:</div>
                    <div>Success Request:</div>
                    <div>Failed Request:</div>
                    <div>Project Count:</div>
                </div>
                <div className={'bot-status-col1'}>
                    <div>{props.status.total}</div>
                    <div className={'success-color'}>{props.status.success}</div>
                    <div className={'error-color'}>{props.status.failed}</div>
                    <div>{props.status.projectCount}</div>
                </div>
            </div>
            <div className={'bot-controls'}>
                <button onClick={props.onRefresh}>Refresh</button>
            </div>
        </div>
    );
}

export default BotControl;