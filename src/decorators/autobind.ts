/**
 * Decorator that automatically binds a method to its class instance.
 * @param _ The class prototype.
 * @param _2 The name of the method.
 * @param descriptor The property descriptor of the method.
 * @returns The adjusted property descriptor with the bound method.
 */
export function AutoBind(
    _: any,
    _2: string,
    descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}

