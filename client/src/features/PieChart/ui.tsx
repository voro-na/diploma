import { FC, PropsWithChildren } from 'react';

import { styled } from '@mui/material/styles';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { PieChart } from '@mui/x-charts/PieChart';

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
    const secondaryY = primaryY + 24;

    return (
        <>
            <StyledText x={left + width / 2} y={primaryY}>
                {children}
            </StyledText>
            <StyledText x={left + width / 2} y={secondaryY}>
                покрыто
            </StyledText>
        </>
    );
};

export const PieChartWithCenterLabel: FC<{
    passTests?: number;
    allTests?: number;
}> = ({ allTests = 3, passTests = 2 }) => {
    const percent =
        allTests !== undefined && passTests !== undefined
            ? Math.round((passTests / allTests) * 100)
            : undefined;

    const data = [
        {
            value: (allTests || 0) - (passTests || 0),
            label: 'FAIL',
            color: red[200],
        },
        { value: passTests || 0, label: 'PASS', color: brand[200] },
    ];

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
                    // padding: 50,
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
