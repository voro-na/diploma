import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feature, FeatureDocument } from '../schemas/feature.schema';
import { Group, GroupDocument } from '../schemas/group.schema';
import { ProjectHelpers } from '../helpers/project.helpers';
import { TestGroup } from '../schemas/tests.schema';
import { TestsService } from './tests.service';

@Injectable()
export class FeatureService {
    constructor(
        @InjectModel(Feature.name) private featureModel: Model<FeatureDocument>,
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
        private readonly testGroupService: TestsService,
        private projectHelpers: ProjectHelpers,
    ) { }

    /**
     * Creates a new feature in a group if it doesn't exist
     * @param projectSlug The slug of the project
     * @param groupSlug The slug of the group
     * @param featureSlug The slug of the feature to create
     * @param featureName Optional name for the feature (defaults to slug)
     * @returns The created or existing feature
     */
    async createFeature(
        projectSlug: string,
        groupSlug: string,
        featureSlug: string,
        featureName?: string,
    ): Promise<Feature> {
        const group = await this.projectHelpers.checkGroupExists(projectSlug, groupSlug);

        const existingFeature = await this.featureModel.findOne({
            slug: featureSlug,
            group: group._id,
        });
        if (existingFeature) {
            throw new BadRequestException(`Feature with slug "${featureSlug}" already exists in group "${groupSlug}"`);
        }

        const feature = new this.featureModel({
            slug: featureSlug,
            name: featureName || featureSlug,
            group: group._id,
        });

        await feature.save();

        await this.groupModel.findByIdAndUpdate(
            group._id,
            { $push: { features: feature._id } },
            { new: true }
        );

        return feature;
    }

    async removeFeature(
        projectSlug: string,
        groupSlug: string,
        featureSlug: string,
    ): Promise<Feature> {
        const feature = await this.projectHelpers.checkFeatureExists(projectSlug, groupSlug, featureSlug);
        const group = await this.projectHelpers.checkGroupExists(projectSlug, groupSlug);

        if (feature.testGroup && feature.testGroup.length > 0) {
            for (const testGroupId of feature.testGroup) {
                await this.testGroupService.removeTestGroup(
                    projectSlug,
                    groupSlug,
                    featureSlug,
                    testGroupId.toString()
                );
            }
        }

        const deletedFeature = await this.featureModel.findByIdAndDelete(
            feature._id)

        await this.groupModel.findByIdAndUpdate(
            group._id,
            {
                $pull: { features: feature._id },
            },
            { new: true }
        );

        return deletedFeature;
    }
} 