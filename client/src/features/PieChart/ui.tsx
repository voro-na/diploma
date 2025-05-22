// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { FC, PropsWithChildren, useMemo } from 'react';

import { orange } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { PieChart } from '@mui/x-charts/PieChart';

import { ITestGroup, Status } from '@/entities/project';
import { brand, red } from '@/shared/customization';

const size = {
    width: 250,
    height: 150,
};
const StyledText = styled('text')(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 16,
}));

const PieCenterLabel: FC<PropsWithChildren> = ({ children }) => {
    const { width, height, left, top } = useDrawingArea();

    const primaryY = top + height / 2 - 10;
    const secondaryY = primaryY + 20;

    
    return (
        <>
            <StyledText x={left + width / 2} y={primaryY}>
                {children}
            </StyledText>
            <StyledText x={left + width / 2} y={secondaryY}>
                покрытие
            </StyledText>
        </>
    );
};

export const PieChartWithCenterLabel: FC<{
    tests: ITestGroup[];
}> = ({ tests }) => {
    const { data, percent } = useMemo(() => {
        const allTests = tests.flatMap(group => group.tests);
        const statusCounts = allTests.reduce((acc, test) => {
            acc[test.status] = (acc[test.status] || 0) + 1;
            return acc;
        }, {} as Record<Status, number>);

        const totalTests = allTests.length;
        const passedTests = statusCounts[Status.PASS] || 0;

        return {
            data: [
                {
                    value: statusCounts[Status.PASS] || 0,
                    label: 'PASSED',
                    color: brand[200],
                },
                {
                    value: statusCounts[Status.FAIL] || 0,
                    label: 'FAILED',
                    color: red[200],
                },
                {
                    value: statusCounts[Status.SKIP] || 0,
                    label: 'SKIPPED',
                    color: orange[200],
                },
            ],
            percent: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0,
        };
    }, [tests]);

    return (
        <PieChart
            series={[
                {
                    data,
                    innerRadius: 55,
                    highlightScope: {
                        faded: 'global',
                        highlighted: 'item',
                    },
                },
            ]}
            slotProps={{
                legend: {
                    itemMarkHeight: 10,
                    itemMarkWidth: 10,
                    labelStyle: {
                        fontSize: 14,
                    },
                },
            }}
            {...size}
        >
            <PieCenterLabel>{percent} %</PieCenterLabel>
        </PieChart>
    );
};
