import { ITestGroup, Status } from '@/entities/project';

export interface ITestRowData {
    status?: Status;
    test: string;
    id: string;
    isNew?: boolean;
}

export const getRowsData = (tests: ITestGroup[]) => {
    return (
        tests?.reduce((acc: ITestRowData[], testGroup) => {
            acc.push({
                status: undefined,
                test: testGroup.name,
                id: testGroup._id,
            });

            testGroup.tests.forEach((test) => {
                acc.push({
                    status: test.status,
                    test: test.name,
                    id: test.name + testGroup._id,
                });
            });

            return acc;
        }, []) || []
    );
};
