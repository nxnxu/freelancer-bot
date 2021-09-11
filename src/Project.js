import React from 'react';
import {useState} from 'react';
import './Project.css'
import * as timeago from 'timeago.js';

function Project(props) {

    const [hide, setHide] = useState(true);

    const project = props.project;
    const viewAction = () => setHide(prev => !prev);
    const openAction = () => window.open(`https://www.freelancer.com/projects/${props.project.seo_url}`, '_blank');

    // find elapsed time since the project was added
    let elapsed_time = new Date(1970, 0, 1);
    elapsed_time.setSeconds(project.time_submitted);
    elapsed_time = timeago.format(elapsed_time);

    // budget string. min budget  - max budget
    const budget = `${project.budget.minimum} - ${project.budget.maximum}`

    return (
        <div className='project'>
            <div className='project-header'>
                <div className='project-title'>{project.title}</div>
                <div className='project-actions'>
                    <button className='project-action' onClick={viewAction}>view</button>
                    <button className='project-action' onClick={openAction}>open</button>
                </div>
            </div>

            {hide ? null :
                <div className='project-body'>
                    {project.description}
                </div>
            }

            <div className={'project-footer'}>
                <div className={'project-footer-item color-lightgreen'}> {budget} {project.currency.country}</div>
                <div className={'project-footer-item color-red'}>{elapsed_time}</div>
            </div>
        </div>
    );
}

export default Project;