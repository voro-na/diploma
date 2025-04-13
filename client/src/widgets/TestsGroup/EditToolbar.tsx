import { Button } from '@mui/material';
import { 
    GridRowsProp, 
    GridRowModesModel, 
    GridRowModes, 
    GridToolbarContainer, 
    GridSlotProps
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { Status } from '@/entities/project';

// Generate a unique ID for new rows
export const generateUniqueId = () => {
    return 'new-test-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
        setRowModesModel: (
            newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
        ) => void;
    }
}

export function EditToolbar(props: GridSlotProps['toolbar']) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = generateUniqueId();
        setRows((oldRows) => [
            ...oldRows,
            { id, test: '', status: Status.FAIL, isNew: true },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'test' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add test
            </Button>
        </GridToolbarContainer>
    );
}
