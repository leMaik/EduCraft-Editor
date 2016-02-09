export interface Module {
    name:string,
    code:string,
    lastModified?:Date
}

export interface BlocklyModule extends Module {
    blockly:string;
}