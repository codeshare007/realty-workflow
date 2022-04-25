export class SelectItem {
    constructor(
        public value: string,
        public id: string,
        public data?: SelectItemData,
    ) { }
}

export class SelectItemData {
    constructor(
        public type: any,
    ) { }
}
