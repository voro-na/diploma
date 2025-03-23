import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Document } from 'mongoose';
import { Feature, Group, Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/project.dto';
import { CreateTestGroupDto } from './dto/tests.dto';
import { TestGroup } from './schemas/tests.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(TestGroup.name) private testsModel: Model<TestGroup>,
    @InjectModel(Feature.name) private featureModel: Model<Feature>,
  ) { }

  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }

  async findProjectById(id: string): Promise<Project> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const project = await this.projectModel.findById(id).exec();

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }

  async findProject(slug: string) {
    const project = await this.projectModel.findOne({ slug }).exec();

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
    groupName?: string
  ): Promise<Group> {
    // Find the project using the existing findProject method
    const project = await this.findProject(projectSlug);

    // Check if group already exists
    let group = project.groups.find((g) => g.slug === groupSlug);

    // If group doesn't exist, create it
    if (!group) {

      group = {
        slug: groupSlug,
        name: groupName || groupSlug,
        features: []
      };

      // Add the new group to the project
      project.groups.push(group);

      await project.save();
    }

    return group;
  }

  /**
   * Creates a new feature in a group if it doesn't exist
   * @param projectSlug The slug of the project
   * @param group The group to add the feature to
   * @param featureSlug The slug of the feature to create
   * @param featureName Optional name for the feature (defaults to slug)
   * @returns The created or existing feature
   */
  async createFeature(
    projectSlug: string,
    groupSlug: string,
    featureSlug: string,
    featureName?: string
  ) {
    const project = await this.findProject(projectSlug);

    let group = project.groups.find((g) => g.slug === groupSlug);
    let feature = group.features.find((f) => f.slug === featureSlug);

    if (!feature) {
      feature = {
        slug: featureSlug,
        name: featureName || featureSlug,
        allTestCount: 0,
        passTestCount: 0,
        testGroup: []
      };

      // Add the new feature to the group
      group.features.push(feature);

      await project.save();
    }

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
  async addTests(
    projectSlug: string,
    groupSlug: string,
    featureSlug: string,
    tests: CreateTestGroupDto[],
  ): Promise<Project> {
    const project = await this.projectModel.findOne({ slug: projectSlug });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Find or create group
    let group = project.groups.find((g) => g.slug === groupSlug);
    if (!group) {
      group = {
        slug: groupSlug,
        name: groupSlug,
        features: [],
      };
      project.groups.push(group);
    }
    const createdTestGroups = await this.testsModel.insertMany(tests);

    // Find or create feature
    let feature = group.features.find((f) => f.slug === featureSlug);

    if (!feature) {
      feature = {
        slug: featureSlug,
        name: featureSlug,
        testGroup: createdTestGroups.map((tg) => tg._id),
        allTestCount: 0,
        passTestCount: 0,
      };
      group.features.push(feature);
    } else {
      feature.testGroup.push(...createdTestGroups.map((tg) => tg._id));
    }

    // feature.allTestCount = (feature.allTestCount || 0) + tests.reduce((sum, group) =>
    //   sum + group.tests.length, 0);
    // feature.passTestCount = (feature.passTestCount || 0) + tests.reduce((sum, group) =>
    //   sum + group.tests.filter(test => test.status === 'passed').length, 0);

    await project.save();

    return this.projectModel
      .findOne({ slug: projectSlug })
      .populate({
        path: 'groups.features.testGroup',
        model: 'TestGroup'
      })
      .exec();
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
    const project = await this.projectModel.findOne({ slug: projectSlug });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const group = project.groups.find((g) => g.slug === groupSlug);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const feature = group.features.find((f) => f.slug === featureSlug);
    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    const testGroups = await this.testsModel.find({
      _id: { $in: feature.testGroup },
    });

    return { info: feature, tests: testGroups };
  }

  async removeFeature(
    projectSlug: string,
    groupSlug: string,
    featureSlug: string
  ): Promise<Project> {
    const project = await this.projectModel.findOne({ slug: projectSlug });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const group = project.groups.find((g) => g.slug === groupSlug);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const featureIndex = group.features.findIndex((f) => f.slug === featureSlug);
    if (featureIndex === -1) {
      throw new NotFoundException('Feature not found');
    }

    group.features.splice(featureIndex, 1);

    await project.save();

    return this.projectModel
      .findOne({ slug: projectSlug })
      .populate({
        path: 'groups.features.testGroup',
        model: 'TestGroup',
      })
      .exec();
  }
}
