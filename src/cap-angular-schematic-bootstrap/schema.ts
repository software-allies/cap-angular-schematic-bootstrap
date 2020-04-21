export interface Schema {
    version: string;
    skipWebpackPlugin: boolean;
    bootstrap?: string;
    popper?: string;
    jquery?: string;
    typesJquery?: string;
}