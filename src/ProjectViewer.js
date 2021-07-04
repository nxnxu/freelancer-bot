import Project from "./Project";
import './ProjectViewer.css'

function ProjectViewer(props) {
    const projects = props.projects.map(project => {
        return (
            <div key={project.id}>
                <Project onOpen={props.onOpen} onHide={props.onHide} removeProject={props.removeProject} project={project}/>
            </div>
        );
    });

    return (
        <div className='project-viewer'>
            {projects}
        </div>
    );
}

export default ProjectViewer;