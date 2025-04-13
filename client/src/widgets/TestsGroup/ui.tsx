import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Box, Card } from '@mui/material';
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
    GridPreProcessEditCellProps,
    GridValidRowModel,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

import { useGetTestsDetailsQuery } from '@/entities/project';
import { Status } from '@/entities/project';
import {
    useAddTestMutation,
    useRemoveTestMutation,
} from '@/entities/tests/api';

import styles from './styles.module.css';
import { renderStatus } from './components/Status';
import { EditToolbar } from './components/EditToolbar';
import { getRowsData } from './helpers';
import { TestsTableHeader } from './components/TestsTableHeader';

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
    const [removeTest] = useRemoveTestMutation();
    const [addTest] = useAddTestMutation();

    const [rows, setRows] = useState<GridRowsProp>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    useEffect(() => {
        setRows(featureData ? getRowsData(featureData?.tests) : []);
    }, [featureData]);

    if (!featureData) {
        return null;
    }
    const { info, tests } = featureData;

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (
        params,
        event
    ) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.Edit },
        });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View },
        });
    };

    const handleDeleteClick = (row: GridValidRowModel) => async () => {
        const groupId = featureData.tests.reduce((acc, testGroup) => {
            if (testGroup.tests.find((test) => test.name === row.test)) {
                return testGroup._id;
            }
            return acc;
        }, '');

        try {
            await removeTest({
                projectSlug: projectId,
                groupSlug,
                featureSlug,
                testGroupId: groupId,
                removeTestData: {
                    testName: row.test,
                },
            });
            await refetch();
        } catch (error) {}
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

        //TODO
        const testGroup = tests.find((group) => group.tests.length > 0);

        if (testGroup) {
            try {
                await addTest({
                    projectSlug: projectId,
                    groupSlug,
                    featureSlug,
                    testGroupId: testGroup._id,
                    testData: {
                        name: newRow.test,
                        status: Status.FAIL,
                    },
                });
                await refetch();
            } catch (error) {}
        }

        return updatedRow;
    };

    return (
        <Card variant='outlined'>
            <TestsTableHeader info={info} />

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
                            preProcessEditCellProps: (
                                params: GridPreProcessEditCellProps
                            ) => {
                                const hasError =
                                    params.props.value.trim() === '';
                                return {
                                    ...params.props,
                                    error: hasError,
                                    helperText: hasError
                                        ? 'Название теста не может быть пустым'
                                        : '',
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

                                const isInEditMode =
                                    rowModesModel[id]?.mode ===
                                    GridRowModes.Edit;

                                if (isInEditMode) {
                                    return [
                                        <GridActionsCellItem
                                            icon={<SaveIcon />}
                                            label='Save'
                                            sx={{
                                                color: 'primary.main',
                                            }}
                                            onClick={handleSaveClick(id)}
                                        />,
                                        <GridActionsCellItem
                                            icon={<CancelIcon />}
                                            label='Cancel'
                                            className='textPrimary'
                                            onClick={handleCancelClick(id)}
                                            color='inherit'
                                        />,
                                    ];
                                }

                                return [
                                    <GridActionsCellItem
                                        icon={<EditIcon />}
                                        label='Edit'
                                        className='textPrimary'
                                        onClick={handleEditClick(id)}
                                        color='inherit'
                                    />,
                                    <GridActionsCellItem
                                        icon={<DeleteIcon />}
                                        label='Delete'
                                        onClick={handleDeleteClick(row)}
                                        color='inherit'
                                    />,
                                ];
                            },
                        },
                    ]}
                    editMode='row'
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
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
