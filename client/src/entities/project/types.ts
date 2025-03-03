export interface IProject {
    _id: string;
    slug: string;
    name: string;
    description?: string | null;
    groups: IGroup[];
}

export interface IGroup {
    _id: string;
    slug: string;
    name: string;
    description?: string | null;
    features: IFeature[];
}

export interface IFeature {
    _id: string;
    slug: string;
    name: string;
    description?: string | null;
    allTestCount?: number;
    passTestCount?: number;
}
