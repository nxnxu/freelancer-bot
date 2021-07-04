import React from "react";
import './Project.css'

class Project extends React.Component {
    constructor(props) {
        super(props);
        this.xAction = this.xAction.bind(this);
        this.viewAction = this.viewAction.bind(this);
        this.hideAction = this.hideAction.bind(this);
        this.openAction = this.openAction.bind(this);
        this.state = {hide: true};
    }

    xAction(event) {
        this.props.removeProject(this.props.project.id);
    }

    viewAction(event) {
        this.setState(prev => {
            return {hide: !prev.hide};
        })
    }

    hideAction(event) {
        this.props.onHide(this.props.project);
    }

    openAction(event) {
        this.props.onOpen(this.props.project);
    }

    render() {
        const project = this.props.project;
        return (
            <div className='project'>
                <div className='project-header'>
                    <div className='project-title'>{project.title}</div>
                    <div className='project-actions'>
                        <button className='project-action' onClick={this.openAction}>open</button>
                        <button className='project-action' onClick={this.viewAction}>view</button>
                        <button className='project-action' onClick={this.hideAction}>hide</button>
                    </div>
                </div>

                {this.state.hide ? null :
                    <div className='project-body'>
                        {project.description}
                    </div>
                }

            </div>
            // <div className='project'>
            //     <div className='project-header'>
            //         <div className='project-title'>
            //             {project.title}
            //         </div>
            //         <div className='project-actions'>
            //             <button className='project-action' onClick={this.xAction}>X</button>
            //             <button className='project-action' onClick={this.xAction}>X</button>
            //         </div>
            //     </div>
            //     <div className='project-description'>
            //         {project.description}
            //     </div>
            // </div>
        );

    }
}

export default Project;