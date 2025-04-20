import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Chip, ChipOwnProps, Tooltip } from "@mui/material";

import { Status } from "@/entities/project";

import styles from './Status.module.css';

export const renderStatus = (status: Status) => {
    const colors: Record<Status, ChipOwnProps['color']> = {
        [Status.PASS]: 'info',
        [Status.FAIL]: 'error',
        [Status.SKIP]: 'warning',
    };

    const icons = {
        [Status.PASS]: <DoneIcon sx={{ fontSize: 20 }} />,
        [Status.FAIL]: <CloseIcon sx={{ fontSize: 20 }} />,
        [Status.SKIP]: <QuestionMarkIcon sx={{ fontSize: 20 }} />,
    };

    const tooltips = {
        [Status.PASS]: 'Тест пройден',
        [Status.FAIL]: 'Тест не написан или не пройден',
        [Status.SKIP]: 'Тест пропущен',
    };

    return (
        <Tooltip title={tooltips[status] || tooltips[Status.FAIL]}>
            <Chip
                color={colors[status] || 'error'}
                size="medium"
                label={icons[status] || <CloseIcon sx={{ fontSize: 20 }} />}
                className={styles.statusChip}
                classes={{
                    label: styles.statusLabel
                }}
            />
        </Tooltip>
    );
};
