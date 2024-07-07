import { AutoBind } from "../decorators/autobind";
import { Draggable } from "../models/drag-drop-interfaces";
import { Project } from "../models/project-model";
import { Component } from "./base-component";

/**
 * Represents a project item component.
 * @class
 * @extends Component
 * @implements Draggable
 */
export class ProjectItem
    extends Component<HTMLUListElement, HTMLLIElement>
    implements Draggable {

    get persons() {
        if (this.prjItem.people === 1) {
            return '1 person';
        } else {
            return `${this.prjItem.people} persons`;
        }
    }

    /**
     * Creates an instance of ProjectItem.
     * @constructor
     * @param {string} hostId - The ID of the host element.
     * @param {Project} prjItem - The project item.
     */
    constructor(hostId: string, private prjItem: Project) {
        super('single-project', hostId, false, ProjectItem.name);
        this.renderContent();
        this.configure();

    }

    /**
     * Event handler for the dragstart event.
     * @param {DragEvent} event - The drag event.
     */
    @AutoBind
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain', this.prjItem.id);
        event.dataTransfer!.effectAllowed = 'move';
    }

    dragEndHandler(_: DragEvent): void {
        console.log('DragEnd');
    }

    configure(): void {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }

    renderContent(): void {
        this.element.querySelector('h2')!.textContent = this.prjItem.title;
        this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
        this.element.querySelector('p')!.textContent = this.prjItem.description;
    }
}
