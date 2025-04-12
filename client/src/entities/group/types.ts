import { IGroup } from '../project/types';

export interface CreateGroupRequest {
    name?: string;
}

export interface RemoveGroupResponse {
    success: boolean;
}

export type GroupResponse = IGroup;
