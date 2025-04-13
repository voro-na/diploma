import { Status } from "@/entities/project";
import { ChipOwnProps, Chip } from "@mui/material";

export const renderStatus = (status: Status) => {
    const colors: Record<Status, ChipOwnProps['color']> = {
        [Status.PASS]: 'success',
        [Status.FAIL]: 'error',
        [Status.SKIP]: 'default',
    };

    return <Chip label={status} color={colors[status]} variant='outlined' />;
};