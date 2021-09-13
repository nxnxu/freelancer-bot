import React, {useEffect, useState} from 'react';
import BotControl  from './BotControl';
import ProjectViewer from './ProjectViewer';
import BotJob from './BotJob';
import './Bot.css'
import request from './requests';

const defaultJobs = [
    {id: 0, name: 'All'},
    {id: 6, name: 'C'},
    {id: 448, name: 'Assembly'},
    {id: 320, name: 'C++'},
    {id: 31, name: 'Linux'},
    {id: 336, name: 'UNIX'},
    {id: 508, name: 'x86'},
];

// Return projects whose has a job === jobId
function filterProjects(projects, jobId) {
    return projects.filter(project => {
        if (jobId === 0)
            return true;
        for (const job of project.jobs) {
            if (job.id === jobId)
                return true;
        }
        return false;
    }).sort((lhs, rhs) => {
        return (rhs.time_submitted - lhs.time_submitted);
    });
}

function Bot(props) {

    const [jobs, setJobs] = useState(defaultJobs.slice());
    const [allJobs, setAllJobs] = useState(defaultJobs.slice());
    const [job, setJob] = useState(0);
    const [projects, setProjects] = useState([]);
    const [requestStatus, setRequestStatus] = useState({total: 0, success: 0, failed: 0});

    // Get All jobs. Populate allJobs hook
    useEffect(() => {
        const option = {
            hostname: 'www.freelancer.com',
            port: 443,
            path: '/api/projects/0.1/jobs/?active_project_count_details=true&webapp=1&compact=true&new_errors=true&new_pools=true',
            method: 'GET',
        }
        request.getResponse(option, data => {
            const result = JSON.parse(data).result;
            const newAllJobs = [];
            for (const job of result) {
                newAllJobs.push({id: job.id, name: job.name});
            }
            setAllJobs(newAllJobs);
        });
    }, []);

    // Fetch new projects and add them to projects hook
    const refreshJob = (code) => {
        const option = {
            hostname: 'www.freelancer.com',
            port: 443,
            path: `/api/projects/0.1/projects/active?limit=20&full_description=true&job_details=true&location_details=true&upgrade_details=true&user_country_details=true&user_details=true&user_employer_reputation=true&jobs[]=${code}&languages[]=en&sort_field=submitdate&webapp=1&compact=true&new_errors=true&new_pools=true`,
            method: 'GET',
        }
        setRequestStatus(prev => {return {...prev, total: prev.total+1}});
        request.getResponse(option, data => {
            const result = JSON.parse(data).result;
            if (result && result.projects) {
                setRequestStatus(prev => {return {...prev, success: prev.success+1}});
            } else {
                setRequestStatus(prev => {return {...prev, failed: prev.failed+1}});
            }
            if (result && result.projects) {
                setProjects(oldProjects => {
                    const newProjects = oldProjects.slice();
                    for (const newProject of result.projects) {
                        let found = false;
                        for (const project of newProjects) {
                            if (project.id === newProject.id) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            newProjects.push(newProject);
                        }
                    }
                    return newProjects;
                });
            }
        }, error => setRequestStatus(prev => {return {...prev, failed: prev.failed+1}}));
    };

    const onJobAdd = (id, name) => {
        setJobs(oldJobs => {
            for (const job of oldJobs) {
                if (job.id === id)
                    return oldJobs;
            }
            const newJobs = oldJobs.slice();
            newJobs.push({id: id, name: name});
            return newJobs;
        });
    }

    const onRefresh = () => {
        const jobCodes = jobs.map(job => job.id).filter(id => job === 0 || id === job);
        jobCodes.map(refreshJob);
    }

    const onJobSelect = (id) => {
        setJob(Number(id));
    }

    const filteredProjects = filterProjects(projects, job);

    return (
      <div className='bot'>
          <div className='bot-left-panel'>
              <div className={'bot-left-control-panel'}>
                <BotControl status={{...requestStatus, projectCount: filteredProjects.length}} onRefresh={onRefresh}/>
              </div>
              <div className={'bot-left-jobs-panel'}>
                  <BotJob allJobs={allJobs} jobs={jobs} job={job} onJobAdd={onJobAdd} onJobSelect={onJobSelect}/>
              </div>
          </div>
          <div className='bot-right-panel'>
              <ProjectViewer projects={filteredProjects}/>
          </div>
      </div>
    );
}

export default Bot;