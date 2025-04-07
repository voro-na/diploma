import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../schemas/project.schema';
import { Group } from '../schemas/group.schema';
import { CreateProjectDto } from '../dto/project.dto';
import { CreateTestGroupDto } from '../dto/tests.dto';
import { TestGroup } from '../schemas/tests.schema';
import { Feature } from '../schemas/feature.schema';
import { ProjectHelpers } from '../helpers/project.helpers';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Feature.name) private featureModel: Model<Feature>,
    @InjectModel(TestGroup.name) private testsModel: Model<TestGroup>,
    private projectHelpers: ProjectHelpers,
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
   * Creates a new test group in a feature
   * @param projectSlug The slug of the project
   * @param groupSlug The slug of the group
   * @param featureSlug The slug of the feature
   * @param testGroupData The data for the test group
   * @returns The created test group
   */
  async createTestGroup(
    projectSlug: string,
    groupSlug: string,
    featureSlug: string,
    testGroupData: CreateTestGroupDto,
  ): Promise<TestGroup> {
    const feature = await this.projectHelpers.checkFeatureExists(projectSlug, groupSlug, featureSlug);

    const testGroup = new this.testsModel({
      name: testGroupData.name,
      tests: testGroupData.tests,
      feature: feature._id,
    });

    await testGroup.save();

    await this.featureModel.findByIdAndUpdate(
      feature._id,
      { $push: { testGroup: testGroup._id } },
      { new: true }
    );

    return testGroup;
  }

  /**
   * Finds tests for a feature, creating the group and feature if they don't exist
   * @param projectSlug The slug of the project
   * @param groupSlug The slug of the group
   * @param featureSlug The slug of the feature
   * @returns The feature info and test groups
   */
  async findTests(
    projectSlug: string,
    groupSlug: string,
    featureSlug: string,
  ): Promise<{ info: Feature; tests: TestGroup[] }> {
    const feature = await this.projectHelpers.checkFeatureExists(projectSlug, groupSlug, featureSlug);

    const testGroups = await this.testsModel.find({
      _id: { $in: feature.testGroup },
    }).exec();

    return { info: feature, tests: testGroups };
  }

  /**
   * Removes a test group from a feature
   * @param projectSlug The slug of the project
   * @param groupSlug The slug of the group
   * @param featureSlug The slug of the feature
   * @param testGroupId The ID of the test group to remove
   * @returns The updated feature
   */
  async removeTestGroup(
    projectSlug: string,
    groupSlug: string,
    featureSlug: string,
    testGroupId: string,
  ): Promise<Feature> {
    const feature = await this.projectHelpers.checkFeatureExists(projectSlug, groupSlug, featureSlug);

    const testGroup = await this.testsModel.findById(testGroupId);
    if (!testGroup) {
      throw new NotFoundException(`Test group with ID ${testGroupId} not found`);
    }

    if (!feature.testGroup.includes(testGroup._id)) {
      throw new BadRequestException(`Test group with ID ${testGroupId} does not belong to feature ${featureSlug}`);
    }

    await this.testsModel.findByIdAndDelete(testGroupId);

    const updatedFeature = await this.featureModel.findByIdAndUpdate(
      feature._id,
      {
        $pull: { testGroup: testGroupId },
      },
      { new: true }
    );

    return updatedFeature;
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
}
