// Types
export interface Option {
    value: string;
    label: string;
}

export interface MultiSelectSearchProps {
    options: Option[];
    placeholder?: string;
    value?: string[];
    onChange?: (values: string[]) => void;
    className?: string;
}

export interface SingleSelectSearchProps {
    options: Option[];
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

export interface NormalSelectProps {
    options: Option[];
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}