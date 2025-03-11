import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Feature, Project } from './schemas/project.schema';
import { CreateProjectDto } from './dto/project.dto';
import { CreateTestGroupDto } from './dto/tests.dto';
import { TestGroup } from './schemas/tests.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(TestGroup.name) private testsModel: Model<TestGroup>,
    @InjectModel(Feature.name) private featureModel: Model<Feature>,
  ) {}

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

  async findProject(slug: string): Promise<Project> {
    const project = await this.projectModel.findOne({ slug }).exec();

    if (!project) {
      throw new NotFoundException(`Project with slug ${slug} not found`);
    }
    return project;
  }

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

    const group = project.groups.find((g) => g.slug === groupSlug);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    const feature = group.features.find((f) => f.slug === featureSlug);
    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    const createdTestGroups = await this.testsModel.insertMany(tests);

    feature.testGroup.push(...createdTestGroups.map((tg) => tg._id));

    await project.save();

    return this.projectModel
      .findOne({ slug: projectSlug })
      .findOne({ slug: featureSlug })
      .populate('testGroup')
      .exec();
  }

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
}
