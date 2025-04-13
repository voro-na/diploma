import { FC, useState } from 'react';
import { useRouter } from 'next/router';

import { Box, Card, Stack, Typography } from '@mui/material';
import { 
    DataGrid, 
    GridRowsProp, 
    GridRowModesModel, 
    GridRowModes, 
    GridActionsCellItem, 
    GridEventListener, 
    GridRowId, 
    GridRowModel, 
    GridRowEditStopReasons,
    GridPreProcessEditCellProps
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

import { PieChartWithCenterLabel } from '@/features/PieChart';
import { ITestGroup, useGetTestsDetailsQuery } from '@/entities/project';
import { Status } from '@/entities/project';
import { useAddTestMutation } from '@/entities/tests/api';

import styles from './styles.module.css';
import { renderStatus } from './Status';
import { EditToolbar } from './EditToolbar';

interface ITestRowData {
    status?: Status;
    test: string;
    id: string;
    isNew?: boolean;
}

export const TestsGroup: FC = () => {
    const router = useRouter();
    const projectId = router.query.projectId as string;
    const groupSlug = router.query.group as string;
    const featureSlug = router.query.feature as string;

    const { data: featureData, refetch } = useGetTestsDetailsQuery({
        projectSlug: projectId,
        groupSlug,
        featureSlug,
    });
    const [addTest] = useAddTestMutation();

    const getRowsData = (tests: ITestGroup[]) => {
        return tests?.reduce((acc: ITestRowData[], testGroup) => {
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
        }, []) || [];
    };

    const [rows, setRows] = useState<GridRowsProp>(featureData ? getRowsData(featureData.tests) : []);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    if (!featureData) {
        return null;
    }

    const { info, tests } = featureData;

    // Update rows when featureData changes
    if (JSON.stringify(getRowsData(tests)) !== JSON.stringify(rows.filter(row => !row.isNew))) {
        setRows(prevRows => {
            const newRows = getRowsData(tests);
            // Keep any new rows that were added locally
            const localNewRows = prevRows.filter(row => row.isNew);
            return [...newRows, ...localNewRows];
        });
    }

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };


    const handleSaveClick = (id: GridRowId) => async () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const processRowUpdate = async (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        
            // Find the first test group to add the test to
            const testGroup = tests.find(group => group.tests.length > 0);
            console.log(newRow, testGroup)
            
            if (testGroup) {
                try {
                    await addTest({
                        projectSlug: projectId,
                        groupSlug,
                        featureSlug,
                        testGroupId: testGroup._id,
                        testData: {
                            name: newRow.test,
                            status: Status.FAIL
                        }
                    });
                    await refetch();
                    
                    // Remove the row from local state since it will be fetched from the API
                    setRows(rows.filter((row) => row.id !== newRow.id));
                } catch (error) {
                    console.error('Failed to add test:', error);
                }
            }

        return updatedRow;
      };

    return (
        <Card variant='outlined'>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    marginBottom: '10px',
                }}
            >
                <Stack direction='column' justifyContent='center'>
                    <Typography
                        component='h1'
                        variant='subtitle1'
                        sx={{ fontWeight: 'bold' }}
                    >
                        {info.name}
                    </Typography>
                    <Typography
                        component='h2'
                        variant='subtitle2'
                        sx={{ marginBottom: 2 }}
                        gutterBottom
                        color='textSecondary'
                    >
                        {info.description}
                    </Typography>
                </Stack>
                <PieChartWithCenterLabel
                    allTests={info.allTestCount}
                    passTests={info.passTestCount}
                />
            </div>

            <Box sx={{ width: '100%' }}>
                <DataGrid
                    hideFooter
                    getRowClassName={(params) =>
                        !params.row.status ? styles['group'] : ''
                    }
                    rows={rows}
                    columns={[
                        {
                            field: 'test',
                            headerName: 'Название теста',
                            headerClassName: styles['header'],
                            sortable: false,
                            filterable: false,
                            hideable: false,
                            groupable: false,
                            disableColumnMenu: true,
                            flex: 1,
                            colSpan: (_, row) => {
                                if (!row.status) {
                                    return 2;
                                }
                                return undefined;
                            },
                            valueGetter: (value, row) => {
                                if (!row.status) {
                                    return row.test;
                                }
                                return value;
                            },
                            editable: true,
                            preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
                                const hasError = params.props.value.trim() === '';
                                return { 
                                    ...params.props, 
                                    error: hasError,
                                    helperText: hasError ? 'Название теста не может быть пустым' : '',
                                };
                            },
                        },
                        {
                            field: 'status',
                            headerName: 'Статус',
                            headerClassName: styles['header'],
                            sortable: false,
                            filterable: false,
                            hideable: false,
                            groupable: false,
                            disableColumnMenu: true,
                            editable: false,
                            renderCell: (params) =>
                                renderStatus(params.value as Status),
                        },
                        {
                            field: 'actions',
                            type: 'actions',
                            headerName: 'Actions',
                            headerClassName: styles['header'],
                            width: 100,
                            cellClassName: 'actions',
                            getActions: ({ id, row }) => {
                                if (!row.status) {
                                    return [];
                                }
                                
                                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                                if (isInEditMode) {
                                    return [
                                        <GridActionsCellItem
                                            icon={<SaveIcon />}
                                            label="Save"
                                            sx={{
                                                color: 'primary.main',
                                            }}
                                            onClick={handleSaveClick(id)}
                                        />,
                                        <GridActionsCellItem
                                            icon={<CancelIcon />}
                                            label="Cancel"
                                            className="textPrimary"
                                            onClick={handleCancelClick(id)}
                                            color="inherit"
                                        />,
                                    ];
                                }

                                return [
                                    <GridActionsCellItem
                                        icon={<EditIcon />}
                                        label="Edit"
                                        className="textPrimary"
                                        onClick={handleEditClick(id)}
                                        color="inherit"
                                    />,
                                    <GridActionsCellItem
                                        icon={<DeleteIcon />}
                                        label="Delete"
                                        onClick={handleDeleteClick(id)}
                                        color="inherit"
                                    />,
                                ];
                            },
                        },
                    ]}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    processRowUpdate={processRowUpdate}
                    onRowEditStop={handleRowEditStop}
                    slots={{
                        toolbar: EditToolbar,
                    }}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel },
                    }}
                />
            </Box>
        </Card>
    );
};
