import React from "react";
import {useState, useRef, useEffect} from "react";
import './JobAdd.css'

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
 *
 * @param {{id: number, name: string, onAdd: function}} props
 */
function Job(props) {
    return (
        <div className={'job-result'}>
            <p>{props.name}</p>
            <button onClick={() => props.onAdd(props.id, props.name)}>Add</button>
        </div>
    );
}

/**
 *
 * @param {{jobs: Array, onAdd: function}} props
 */
function JobAdd(props) {

    const [jobs, setJobs] = useState([]);
    const wrapperRef = useRef(null);
    useDetectClickOutside(wrapperRef, () => setMatchingJobs(false));

    const setMatchingJobs = (search) => {
        if (search === false) {
            if (jobs.length > 0)
                setJobs([]);
        }
        else if (search !== '') {
            const regex = new RegExp("(^|\\s+)" + search + "(\\S)*", 'i');
            const newJobs = [];
            for (const job of props.jobs) {
                if (job.id !== 0 && job.name.search(regex) !== -1) {
                    newJobs.push(<Job key={job.id} id={job.id} name={job.name} onAdd={props.onAdd}/>);
                }
            }
            setJobs(newJobs);
        }
    };

    return (
        <div ref={wrapperRef}  className={'job-add'}>
            <input type="text" onChange={e => setMatchingJobs(e.target.value)}
                   onFocus={(e) => setMatchingJobs(e.target.value)} />
            <div className={'job-search-result'}>
                {jobs}
            </div>
        </div>
    );
}

export default JobAdd;