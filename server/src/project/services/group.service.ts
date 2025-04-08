import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from '../schemas/group.schema';
import { Project, ProjectDocument } from '../schemas/project.schema';
import { Feature, FeatureDocument } from '../schemas/feature.schema';
import { ProjectHelpers } from '../helpers/project.helpers';
import { FeatureService } from './feature.service';

@Injectable()
export class GroupService {
    constructor(
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
        @InjectModel(Feature.name) private featureModel: Model<FeatureDocument>,
        private projectHelpers: ProjectHelpers,
        private featureService: FeatureService,
    ) { }

    /**
     * Creates a new group in a project if it doesn't exist
     * @param projectSlug The slug of the project
     * @param groupSlug The slug of the group to create
     * @param groupName Optional name for the group (defaults to slug)
     * @returns The created or existing group
     */
    async createGroup(
        projectSlug: string,
        groupSlug: string,
        groupName?: string,
    ): Promise<Group> {
        const project = await this.projectHelpers.checkProjectExists(projectSlug);

        const existingGroup = await this.groupModel.findOne({
            slug: groupSlug,
            project: project._id,
        });

        if (existingGroup) {
            throw new BadRequestException(`Group with slug "${groupSlug}" already exists in project "${projectSlug}"`);
        }

        const group = new this.groupModel({
            slug: groupSlug,
            name: groupName || groupSlug,
            project: project._id,
        });
        await group.save();

        await this.projectModel.findByIdAndUpdate(
            project._id,
            { $push: { groups: group._id } },
            { new: true }
        );

        return group;
    }

    /**
     * Removes a group from a project and all its features
     * @param projectSlug The slug of the project
     * @param groupSlug The slug of the group to remove
     * @returns The removed group
     */
    async removeGroup(
        projectSlug: string,
        groupSlug: string,
    ): Promise<Group> {
        const project = await this.projectHelpers.checkProjectExists(projectSlug);
        const group = await this.projectHelpers.checkGroupExists(projectSlug, groupSlug);

        const features = await this.featureModel.find({ group: group._id });

        for (const feature of features) {
            await this.featureService.removeFeature(
                projectSlug,
                groupSlug,
                feature.slug
            );
        }

        const deletedGroup = await this.groupModel.findByIdAndDelete(group._id);

        await this.projectModel.findByIdAndUpdate(
            project._id,
            {
                $pull: { groups: group._id },
            },
            { new: true }
        );

        return deletedGroup;
    }
}
