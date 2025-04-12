import { Status } from '../project/types';

export interface CreateTest {
    name: string;
    description?: string;
    link?: string;
    status: Status;
}

export interface CreateTestGroup {
    name: string;
    tests: CreateTest[];
}

export interface RemoveTest {
    testName: string;
}

export interface EditTest {
    testName: string;
    newData: CreateTest;
}
