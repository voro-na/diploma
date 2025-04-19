import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Card } from '@mui/material';
import {
    DataGrid,
    GridActionsCellItem,
    GridEventListener,
    GridPreProcessEditCellProps,
    GridRowEditStopReasons,
    GridRowId,
    GridRowModel,
    GridRowModes,
    GridRowModesModel,
    GridRowsProp,
    GridValidRowModel,
} from '@mui/x-data-grid';

import { useGetTestsDetailsQuery } from '@/entities/project';
import { Status } from '@/entities/project';
import {
    useAddTestMutation,
    useCreateTestGroupMutation,
    useRemoveTestGroupMutation,
    useRemoveTestMutation,
} from '@/entities/tests/api';

import { AddGroupButton } from './components/AddGroupButton';
import { AddTestButton } from './components/AddTestButton';
import { renderStatus } from './components/Status';
import { TestsTableHeader } from './components/TestsTableHeader';
import {getRowsData } from './helpers';

import styles from './styles.module.css';

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
    const [createTestGroup] = useCreateTestGroupMutation();
    const [removeTestGroup] = useRemoveTestGroupMutation();

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
        if (!row.status) {
            // Deleting a group
            const groupId = featureData.tests.find(
                (group) => group.name === row.test
            )?._id;
            if (groupId) {
                try {
                    await removeTestGroup({
                        projectSlug: projectId,
                        groupSlug,
                        featureSlug,
                        testGroupId: groupId,
                    });
                    await refetch();
                } catch (error) {
                    console.error('Failed to delete group:', error);
                }
            }
        } else {
            // Deleting a test
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
        }
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

        try {
            if (!newRow.status) {
                // Creating a new group
                await createTestGroup({
                    projectSlug: projectId,
                    groupSlug,
                    featureSlug,
                    testGroupData: {
                        name: newRow.test,
                        tests: [],
                    },
                });
            } else {
                await addTest({
                    projectSlug: projectId,
                    groupSlug,
                    featureSlug,
                    testGroupId: newRow.groupId,
                    testData: {
                        name: newRow.test,
                        status: Status.FAIL,
                    },
                });
            }
            await refetch();
        } catch (error) {}

        return updatedRow;
    };

    return (
        <Card variant='outlined' sx={{overflow: 'auto'}}>
            <TestsTableHeader info={info} />

            <Box sx={{ width: '100%' }}>
                <DataGrid
                    slots={{
                        toolbar: () => (
                            <AddGroupButton
                                setRows={setRows}
                                setRowModesModel={setRowModesModel}
                            />
                        ),
                    }}
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
                            headerAlign: 'right',
                            cellClassName: styles['status'],
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
                            headerName: 'Действия',
                            headerAlign: 'right',
                            headerClassName: styles['header'],
                            width: 100,
                            cellClassName: 'actions',
                            getActions: ({ id, row }) => {
                                if (!row.status) {
                                    return [
                                        <AddTestButton
                                            key='add'
                                            setRows={setRows}
                                            setRowModesModel={setRowModesModel}
                                            groupId={row.id}
                                        />,
                                        <GridActionsCellItem
                                            key='delete'
                                            icon={<DeleteIcon />}
                                            label='Delete'
                                            onClick={handleDeleteClick(row)}
                                            color='inherit'
                                        />,
                                    ];
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
                />
            </Box>
        </Card>
    );
};
