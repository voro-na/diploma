import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../schemas/project.schema';
import { Group, GroupDocument } from '../schemas/group.schema';
import { Feature, FeatureDocument } from '../schemas/feature.schema';

@Injectable()
export class ProjectHelpers {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
        @InjectModel(Feature.name) private featureModel: Model<FeatureDocument>,
    ) { }

    /**
     * Проверяет существование проекта по slug
     * @param projectSlug The slug of the project
     * @returns The project if it exists
     * @throws NotFoundException if the project does not exist
     */
    async checkProjectExists(projectSlug: string) {
        const project = await this.projectModel.findOne({ slug: projectSlug });
        if (!project) {
            throw new NotFoundException(`Project with slug ${projectSlug} not found`);
        }
        return project;
    }

    /**
     * Проверяет существование группы по slug в проекте
     * @param projectSlug The slug of the project
     * @param groupSlug The slug of the group
     * @returns The group if it exists
     * @throws NotFoundException if the project or group does not exist
     */
    async checkGroupExists(projectSlug: string, groupSlug: string): Promise<GroupDocument> {
        const project = await this.checkProjectExists(projectSlug);

        const group = await this.groupModel.findOne({
            slug: groupSlug,
            project: project._id,
        });

        if (!group) {
            throw new NotFoundException(`Group with slug ${groupSlug} not found in project ${projectSlug}`);
        }

        return group;
    }

    /**
     * Проверяет существование фичи по slug в группе
     * @param projectSlug The slug of the project
     * @param groupSlug The slug of the group
     * @param featureSlug The slug of the feature
     * @returns The feature if it exists
     * @throws NotFoundException if the project, group or feature does not exist
     */
    async checkFeatureExists(projectSlug: string, groupSlug: string, featureSlug: string) {
        const group = await this.checkGroupExists(projectSlug, groupSlug);

        const feature = await this.featureModel.findOne({
            slug: featureSlug,
            group: group._id,
        });

        if (!feature) {
            throw new NotFoundException(`Feature with slug ${featureSlug} not found in group ${groupSlug}`);
        }

        return feature;
    }

    /**
     * Gets all groups in a project
     * @param projectId The ID of the project
     * @returns Array of groups in the project
     */
    async getAllProjectGroups(projectId: string) {
        const groups = await this.groupModel.find({
            project: projectId
        });
        return groups;
    }
}
