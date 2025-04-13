import { FC } from 'react';
import { GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { Status } from '@/entities/project';
import {
    GridRowModesModel,
    GridRowModes,
    GridRowsProp,
} from '@mui/x-data-grid';
import { generateUniqueId } from '../helpers';

interface AddTestButtonProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
}

export const AddTestButton: FC<AddTestButtonProps> = ({
    setRows,
    setRowModesModel,
}) => {
    const handleAddTest = () => {
        const newId = generateUniqueId();
        setRows((oldRows) => [
            ...oldRows,
            {
                id: newId,
                test: '',
                status: Status.FAIL,
                isNew: true,
            },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [newId]: {
                mode: GridRowModes.Edit,
                fieldToFocus: 'test',
            },
        }));
    };

    return (
        <GridActionsCellItem
            icon={<AddIcon />}
            label='Add Test'
            onClick={handleAddTest}
            color='primary'
        />
    );
};
