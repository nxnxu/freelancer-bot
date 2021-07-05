import React, {useRef, useState} from "react";
import BotControl from "./BotControl";
import ProjectViewer from "./ProjectViewer";

import './Bot.css'
import request from "./requests";

const defaultJobs = [
    {id: 0, name: 'All'},
    {id: 6, name: 'C'},
    {id: 448, name: 'Assembly'},
    {id: 320, name: 'C++'},
    {id: 31, name: 'Linux'},
    {id: 336, name: 'UNIX'},
    {id: 508, name: 'x86'},
];

function Bot(props) {

    const [state, setState] = useState({
        job: 0,
        projects: [],
        hidden: [],
        status: {
            total: 0,
            success: 0,
            failed: 0,
        },
        settings: {
            refreshTime: 60000,
        }
    });

    const interval = useRef(null);
    const refreshTime = useRef(state.settings.refreshTime);
    //const hidden = useRef([]);

    const refreshJob = (code) => {
        const option = {
            hostname: 'www.freelancer.com',
            port: 443,
            path: `/api/projects/0.1/projects/active?limit=20&full_description=true&job_details=true&location_details=true&upgrade_details=true&user_country_details=true&user_details=true&user_employer_reputation=true&jobs[]=${code}&languages[]=en&sort_field=submitdate&webapp=1&compact=true&new_errors=true&new_pools=true`,
            method: 'GET',
        }

        setState(prev => {
            return {
                ...prev,
                status: {
                    ...prev.status,
                    total: prev.status.total + 1,

                }
            };
        });

        request.getResponse(option, data => {
            const result = JSON.parse(data).result;
            if (result && result.projects) {
                setState(prev => {
                    return {
                        ...prev,
                        status: {
                            ...prev.status,
                            success: prev.status.success + 1,
                        }
                    };
                });
            } else {
                setState(prev => {
                    return {
                        ...prev,
                        status: {
                            ...prev.status,
                            failed: prev.status.failed + 1,
                        }
                    };
                });
            }


            if (result && result.projects) {
                // console.log('refreshing:', code, result.projects.length);
                setState(prev => {
                    //console.log('Before 1', prev);
                    const newState = {...prev};
                    //console.log('Before 2', newState);
                    for (const newProject of result.projects) {
                        let found = false;
                        for (const project of newState.projects) {
                            if (project.id === newProject.id) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            newState.projects.push(newProject);
                        }
                    }
                    //console.log('NewState: ', newState);
                    return newState;
                });
            }
        }, (e) => {

            setState(prev => {
                return {
                    ...prev,
                    status: {
                        ...prev.status,
                        failed: prev.status.failed + 1,
                    }
                };
            });
        });
    }

    const refresh = (jobCodes) => {
        jobCodes.map(refreshJob);
    }

    const autoRefresh = () => {
        // console.log('Auto Refreshing');
        refresh(defaultJobs.map(job => job.id));
    };

    const onProjectOpen = (project) => {
        //console.log(project);
        const url = `https://www.freelancer.com/projects/${project.seo_url}`;
        window.open(url, '_blank');
    }

    const onControlChange = controls => {
        //console.log('Bot:', controls);
        setState(prev => {
            return {
                ...prev,
                job: controls.job,
            };
        });

        if (controls.refresh) {
            //console.log('refresh', state);
            const jobCodes = defaultJobs.map(job => job.id).filter(id => {
                return controls.job === 0 || id === controls.job;
            });
            refresh(jobCodes);
        }

        if (refreshTime.current !== controls.refreshTime) {
            if (interval.current !== null) {
                interval.current();
                interval.current = (() => {
                    const id = setInterval(autoRefresh, controls.refreshTime);
                    return () => {
                        //console.log('clearning interval');
                        clearInterval(id);
                    };
                })();
            }
            refreshTime.current = controls.refreshTime;
        } else {
            if (controls.autoRefresh && interval.current === null) {
                interval.current = (() => {
                    const id = setInterval(autoRefresh, controls.refreshTime);
                    return () => {
                        //console.log('clearning interval');
                        clearInterval(id);
                    };
                })();
            } else if (!controls.autoRefresh && interval.current !== null) {
                interval.current();
                interval.current = null;
            }
        }
    }

    //console.log(state.hidden);
    const projects = state.projects.filter(project => {
        if (state.hidden.includes(project.id))
            return false;
        if (state.job === 0)
            return true;
        for (const job of project.jobs) {
            if (job.id === state.job)
                return true;
        }
        return false;
    });


    const onHide = (project) => {
        const projects = state.projects.filter(arg => {
            return project.id !== arg.id;
        });

        const hidden = state.hidden.slice();
        hidden.push(project.id);
        setState(prev => {
           const hmm = {
               ...prev,
               hidden: hidden,
               projects: projects,
           };

           //console.log('Hmm:', hmm);
           return hmm;
        });
    }

    return (
      <div className='bot'>
          <BotControl settings={state.settings} status={ {...state.status, projectCount: projects.length, hiddenCount: state.hidden.length}} job={state.job} jobs={defaultJobs} onControlChange={onControlChange}/>
          <ProjectViewer onOpen={onProjectOpen} onHide={onHide} projects={projects}/>
      </div>
    );
}

export default Bot;