
/**
 * Represents a base component.
 * @template T - The type of the host element.
 * @template U - The type of the component element.
 */
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    /**
     * Creates an instance of Component.
     * @param {string} templateId - The ID of the template element.
     * @param {string} hostelementId - The ID of the host element.
     * @param {boolean} insertAtStart - Determines whether to insert the component at the start or end of the host element.
     * @param {string} [newElementId] - The ID of the new element.
     */
    constructor(
        templateId: string,
        hostelementId: string,
        insertAtStart: boolean,
        newElementId?: string
    ) {
        this.templateElement = document.getElementById(templateId) as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostelementId) as T;
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as U;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }

    abstract configure(): void;

    abstract renderContent(): void;

    private attach(insertAtStart: boolean) {
        this.hostElement.insertAdjacentElement(
            insertAtStart ? 'afterbegin' : 'beforeend',
            this.element
        );
    }
}