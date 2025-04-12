export interface AddGroupModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (name: string, slug: string, description?: string) => void;
    title: string;
}

export interface FormValues {
    name: string;
    slug: string;
    description: string;
}
