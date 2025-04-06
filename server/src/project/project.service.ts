import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Project } from './schemas/project.schema';
import { Group } from './schemas/group.schema';
import { CreateProjectDto } from './dto/project.dto';
import { CreateTestGroupDto } from './dto/tests.dto';
import { TestGroup } from './schemas/tests.schema';
import { Feature } from './schemas/feature.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(Feature.name) private featureModel: Model<Feature>,
    @InjectModel(TestGroup.name) private testsModel: Model<TestGroup>,
  ) { }

  async createProject(projectData: CreateProjectDto): Promise<Project> {
    if (!projectData.slug) {
      throw new BadRequestException('Project slug is required');
    }

    if (!projectData.name) {
      throw new BadRequestException('Project name is required');
    }

    const existingProject = await this.projectModel.findOne({ slug: projectData.slug }).exec();
    if (existingProject) {
      throw new BadRequestException(`Project with slug "${projectData.slug}" already exists`);
    }

    const project = new this.projectModel(projectData);
    return project.save();
  }

  async findProject(slug: string) {
    const project = await this.projectModel
      .findOne({ slug })
      .populate({ path: 'groups', populate: { path: 'features' } })
      .exec();

    if (!project) {
      throw new NotFoundException(`Project with slug ${slug} not found`);
    }
    return project;
  }

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
    const project = await this.projectModel.findOne({ slug: projectSlug });
    if (!project) {
      throw new NotFoundException(`Project with slug ${projectSlug} not found`);
    }

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
    const project = await this.projectModel.findOne({ slug: projectSlug });
    if (!project) {
      throw new NotFoundException(`Project with slug ${projectSlug} not found`);
    }

    const group = await this.groupModel.findOne({
      slug: groupSlug,
      project: project._id,
    });
    if (!group) {
      throw new NotFoundException(`Group with slug ${groupSlug} not found in project ${projectSlug}`);
    }

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

  /**
   * Adds tests to a feature, creating the group and feature if they don't exist
   * @param projectSlug The slug of the project
   * @param groupSlug The slug of the group
   * @param featureSlug The slug of the feature
   * @param tests The test groups to add
   * @returns The updated project
   */
  // async addTests(
  //   projectSlug: string,
  //   groupSlug: string,
  //   featureSlug: string,
  //   tests: CreateTestGroupDto[],
  // ): Promise<Project> {
  //   const project = await this.projectModel.findOne({
  //     slug: projectSlug,
  //     'groups.slug': groupSlug,
  //     'groups.features.slug': featureSlug,
  //   });

  //   const createdTestGroups = await this.testsModel.insertMany(tests);
  //   const testGroupIds = createdTestGroups.map((tg) => tg._id);

  //   const passTestCount = tests.reduce(
  //     (sum, group) =>
  //       sum + group.tests.filter((test) => test.status === 'passed').length,
  //     0,
  //   );

  //   const allTestCount = tests.reduce(
  //     (sum, group) => sum + group.tests.length,
  //     0,
  //   );

  //   if (project) {
  //     return this.projectModel.findOneAndUpdate(
  //       {
  //         slug: projectSlug,
  //         'groups.slug': groupSlug,
  //         'groups.features.slug': featureSlug,
  //       },
  //       {
  //         $push: {
  //           'groups.$[groupElem].features.$[featureElem].testGroup': {
  //             $each: testGroupIds,
  //           },
  //         },
  //         $inc: {
  //           'groups.$[groupElem].features.$[featureElem].allTestCount':
  //             allTestCount,
  //           'groups.$[groupElem].features.$[featureElem].passTestCount':
  //             passTestCount,
  //         },
  //       },
  //       {
  //         arrayFilters: [
  //           { 'groupElem.slug': groupSlug },
  //           { 'featureElem.slug': featureSlug },
  //         ],
  //         new: true,
  //       },
  //     );
  //   }

  //   const projectWithGroup = await this.projectModel.findOne({
  //     slug: projectSlug,
  //     'groups.slug': groupSlug,
  //   });

  //   const newFeature: Feature = {
  //     slug: featureSlug,
  //     name: featureSlug,
  //     testGroup: testGroupIds,
  //     allTestCount,
  //     passTestCount,
  //   };

  //   if (projectWithGroup) {
  //     return this.projectModel.findOneAndUpdate(
  //       { slug: projectSlug, 'groups.slug': groupSlug },
  //       {
  //         $push: {
  //           'groups.$[group].features': newFeature,
  //         },
  //       },
  //       {
  //         arrayFilters: [{ 'group.slug': groupSlug }],
  //         new: true,
  //       },
  //     );
  //   }

  //   const newGroup: Group = {
  //     slug: groupSlug,
  //     name: groupSlug,
  //     features: [newFeature],
  //   };

  //   return this.projectModel.findOneAndUpdate(
  //     { slug: projectSlug },
  //     {
  //       $push: { groups: newGroup },
  //     },
  //     { new: true },
  //   );
  // }

  /**
   * Finds tests for a feature, creating the group and feature if they don't exist
   * @param projectSlug The slug of the project
   * @param groupSlug The slug of the group
   * @param featureSlug The slug of the feature
   * @returns The feature info and test groups
   */
  // async findTests(
  //   projectSlug: string,
  //   groupSlug: string,
  //   featureSlug: string,
  // ): Promise<{ info: Feature; tests: TestGroup[] }> {
  //   const project = await this.projectModel.findOne({ slug: projectSlug });

  //   if (!project) {
  //     throw new NotFoundException('Project not found');
  //   }

  //   const group = project.groups.find((g) => g.slug === groupSlug);
  //   if (!group) {
  //     throw new NotFoundException('Group not found');
  //   }

  //   const feature = group.features.find((f) => f.slug === featureSlug);
  //   if (!feature) {
  //     throw new NotFoundException('Feature not found');
  //   }

  //   const testGroups = await this.testsModel.find({
  //     _id: { $in: feature.testGroup },
  //   });

  //   return { info: feature, tests: testGroups };
  // }

  // async removeFeature(
  //   projectSlug: string,
  //   groupSlug: string,
  //   featureSlug: string,
  // ): Promise<Project> {
  //   const project = await this.projectModel.findOne({ slug: projectSlug });

  //   if (!project) {
  //     throw new NotFoundException('Project not found');
  //   }

  //   const group = project.groups.find((g) => g.slug === groupSlug);
  //   if (!group) {
  //     throw new NotFoundException('Group not found');
  //   }

  //   const featureIndex = group.features.findIndex(
  //     (f) => f.slug === featureSlug,
  //   );
  //   if (featureIndex === -1) {
  //     throw new NotFoundException('Feature not found');
  //   }

  //   group.features.splice(featureIndex, 1);

  //   await project.save();

  //   return this.projectModel
  //     .findOne({ slug: projectSlug })
  //     .populate({
  //       path: 'groups.features.testGroup',
  //       model: 'TestGroup',
  //     })
  //     .exec();
  // }
}
