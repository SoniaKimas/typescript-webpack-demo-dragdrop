import { AutoBind } from "../decorators/autobind";
import { DragTarget } from "../models/drag-drop-interfaces";
import { Project, ProjectStatus } from "../models/project-model";
import { Component } from "./base-component";
import { ProjectItem } from "./project-item";
import { projectState } from "../state/project-state";

/**
 * Represents a project list component.
 */
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[] = [];

    /**
     * Creates an instance of ProjectList.
     * @param {('active' | 'finished')} type - The type of project list.
     */
    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`);

        this.renderContent();
        this.configure();
    }

    /**
     * Handles the drag over event.
     * @param {DragEvent} event - The drag event.
     */
    @AutoBind
    dragOverHandler(event: DragEvent): void {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }
    }

    /**
     * Handles the drop event.
     * @param {DragEvent} event - The drop event.
     */
    @AutoBind
    dropHandler(event: DragEvent): void {
        const prjId = event.dataTransfer!.getData('text/plain');
        projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
    }

    /**
     * Handles the drag leave event.
     * @param {DragEvent} _ - The drag leave event.
     */
    @AutoBind
    dragLeaveHandler(_: DragEvent): void {
        const listEl = this.element.querySelector('ul')!;
        if (listEl) {
            listEl.classList.remove('droppable');
        }
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent =
            this.type.toUpperCase() + ' PROJECTS';
    }

    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('drop', this.dropHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);

        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(prj => {
                if (this.type === 'active') {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            })
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });

        this.renderContent();
    }

    protected renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = '';
        for (const prjItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
        }
    }
}
