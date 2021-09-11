import {useState, useEffect, useRef} from 'react';
import './BotJob.css'

/**
 *
 * https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
 * Hook that alerts clicks outside of the passed ref
 */
function useDetectClickOutside(ref, callback) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback]);
}


/**
 * https://stackoverflow.com/a/3561711/16803407
 * Escapes any characters that would have special meaning in a regular expression.
 * @param string
 * @returns string
 */
function escapeRegex(string) {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 *
 * @param {{id: number, name: string, onAdd: function}} props
 */
function BotJobSearchResult(props) {
    return (
        <div className={'bot-job-search-result'}>
            <p>{props.name}</p>
            <button onClick={() => props.onJobAdd(props.id, props.name)}>Add</button>
        </div>
    );
}


function BotJob(props){
    const [jobSearchResult, setJobSearchResult] = useState([]);
    const wrapperRef = useRef(null);
    useDetectClickOutside(wrapperRef, () => setMatchingJobs(false));

    const setMatchingJobs = (search) => {
        if (search === false) {
            if (jobSearchResult.length > 0)
                setJobSearchResult([]);
        }
        else if (search !== '') {
            const regex = new RegExp("(^|\\s+)" + escapeRegex(search) + "(\\S)*", 'i');
            const newJobs = [];
            for (const job of props.allJobs) {
                if (job.id !== 0 && job.name.search(regex) !== -1) {
                    newJobs.push(<BotJobSearchResult key={job.id} id={job.id} name={job.name} onJobAdd={props.onJobAdd}/>);
                }
            }
            setJobSearchResult(newJobs);
        }
    };

    const jobs = props.jobs.map(job => {
        return (
            <div key={job.id}>
                <input type="radio" id={'job' + job.id} name='job' value={job.id}
                       onClick={e => props.onJobSelect(e.target.value)}
                       defaultChecked={props.job === job.id}/>
                <label htmlFor={'job' + job.id}>{job.name}</label>
            </div>
        );
    });

    return (
        <div className={'bot-jobs'}>
            <div ref={wrapperRef}  className={'bot-jobs-search'}>
                <input type="text" onChange={e => setMatchingJobs(e.target.value)}
                       onFocus={(e) => setMatchingJobs(e.target.value)} />
                <div className={'bot-jobs-search-results'}>
                    {jobSearchResult}
                </div>
            </div>
            <div className={'bot-jobs-view'}>
                {jobs}
            </div>
        </div>
    );
}

export default BotJob;