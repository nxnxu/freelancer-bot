import React from "react";
import request from "./requests";
import ProjectViewer from "./ProjectViewer";
import './LiveProjects.css'

const wait = 30000000;

class LiveProjects extends React.Component {

    constructor(props) {
        super(props);
        this.tick = this.tick.bind(this);
        this.removeProject = this.removeProject.bind(this);
        this.refreshJob = this.refreshJob.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.state = {
            count: 0,
            projects: [],
            rejected: [],
        };
    }

    componentDidMount() {
        setTimeout(this.tick, 1000);
    }

    handleRefresh() {
        // const jobCodes = [6, 448, 320, 31, 336, 508];
        const jobCodes = [6, 448];
        this.refresh(jobCodes);
    }

    refreshJob(code) {
        console.log('refreshing:', code);
        const option = {
            hostname: 'www.freelancer.com',
            port: 443,
            path: `/api/projects/0.1/projects/active?limit=20&full_description=true&job_details=true&location_details=true&upgrade_details=true&user_country_details=true&user_details=true&user_employer_reputation=true&jobs[]=${code}&languages[]=en&sort_field=submitdate&webapp=1&compact=true&new_errors=true&new_pools=true`,
            method: 'GET',
        }
        request.getResponse(option, data => {
            const result = JSON.parse(data).result;
            if (result && result.projects) {
                const projects = result.projects.slice();
                this.addProjects(projects);
            }
            this.setState(os => {
                return {count: os.count+1};
            });
        });
    }

    refresh(jobCodes) {
        jobCodes.map(this.refreshJob);
    }

    removeProject(id) {
        const rejected = this.state.rejected.slice();
        rejected.push(id);
        const projects = this.state.projects.filter(project => {
            return project.id !== id;
        });

        this.setState({rejected: rejected, projects: projects});
    }

    tick() {
        let options = [];
        let jobCodes = [6, 448, 320, 31, 336, 508];
        for (const code of jobCodes) {
            const option = {
                hostname: 'www.freelancer.com',
                port: 443,
                path: `/api/projects/0.1/projects/active?limit=20&full_description=true&job_details=true&location_details=true&upgrade_details=true&user_country_details=true&user_details=true&user_employer_reputation=true&jobs[]=${code}&languages[]=en&sort_field=submitdate&webapp=1&compact=true&new_errors=true&new_pools=true`,
                method: 'GET',
            }
            options.push(option);
        }
        request.multiRequest2(options, data => {
            const result = JSON.parse(data).result;
            if (result && result.projects) {
                const projects = result.projects.slice();
                this.addProjects(projects);
            }
            this.setState(os => {
                return {count: os.count+1};
            });
        }, () => {
            setTimeout(this.tick, wait);
        }, err => {
            setTimeout(this.tick, wait);
        });
    }

    addProjects(projects) {
        projects = this.state.projects.concat(projects);
        projects = this.uniqueProjects(projects);
        projects.sort((a, b) => {
            if (a.time_updated >= b.time_updated)
                return 0;
            return 1;
        });
        this.setState({projects: projects});
    }

    uniqueProjects(projects) {
        let ids = [];
        return projects.filter(project => {
            const id = project.id;
            if (!ids.includes(id) && !this.state.rejected.includes(id)) {
                ids.push(project.id);
                return true;
            }
            return false;
        });
    }

    render() {
        return (
            <div className='project-viewer-container'>
                <hr/>
                <div className='project-viewer-stats'>
                    <p>Num Requests: {this.state.count}</p>
                </div>
                <div className='project-viewer-window'>
                    <ProjectViewer refresh={this.handleRefresh} removeProject={this.removeProject} projects={this.state.projects}/>
                </div>
            </div>
        );
    }
}

export default LiveProjects