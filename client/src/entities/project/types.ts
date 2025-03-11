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

export const enum Status {
    PASS = 'PASS',
    FAIL = 'FAIL',
    SKIP = 'SKIP',
}

export interface ITest {
    _id: string;
    name: string;
    description?: string;
    link?: string;
    status: Status;
}

export interface ITestGroup {
    _id: string;
    name: string;
    tests: ITest[];
}

export interface ITestsDetailsResponse {
    info: IFeature;
    tests: ITestGroup[];
}
