


export default class OneTimeMutable<T> {
    public value: T
    private initialized: boolean

    constructor(initialValue: T) {
        this.value = initialValue
        this.initialized = false
    }

    public set(newValue: T) {
        if (this.initialized) { return }
        this.value = newValue
        this.initialized = true
    }
}


