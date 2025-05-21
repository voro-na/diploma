import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GroupService } from '../group.service';
import { Group } from '../../schemas/group.schema';
import { Project } from '../../schemas/project.schema';
import { Feature } from '../../schemas/feature.schema';
import { ProjectHelpers } from '../../helpers/project.helpers';
import { FeatureService } from '../feature.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  mockProject,
  mockGroup,
  mockFeature,
  createMockGroupModel,
  createMockProjectModel,
  createMockFeatureModel,
  createMockProjectHelpers,
  createMockFeatureService
} from '../../__mocks__/test.fixtures';

describe('GroupService', () => {
  let service: GroupService;
  let groupModel: Model<Group>;
  let projectModel: Model<Project>;
  let featureModel: Model<Feature>;
  let projectHelpers: ProjectHelpers;
  let featureService: FeatureService;

  let mockGroupModel: ReturnType<typeof createMockGroupModel>;
  let mockProjectModel: ReturnType<typeof createMockProjectModel>;
  let mockFeatureModel: ReturnType<typeof createMockFeatureModel>;
  let mockProjectHelpers: ReturnType<typeof createMockProjectHelpers>;
  let mockFeatureService: ReturnType<typeof createMockFeatureService>;

  beforeEach(async () => {
    mockGroupModel = createMockGroupModel();
    mockProjectModel = createMockProjectModel();
    mockFeatureModel = createMockFeatureModel();
    mockProjectHelpers = createMockProjectHelpers();
    mockFeatureService = createMockFeatureService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: getModelToken(Group.name),
          useValue: mockGroupModel
        },
        {
          provide: getModelToken(Project.name),
          useValue: mockProjectModel
        },
        {
          provide: getModelToken(Feature.name),
          useValue: mockFeatureModel
        },
        {
          provide: ProjectHelpers,
          useValue: mockProjectHelpers
        },
        {
          provide: FeatureService,
          useValue: mockFeatureService
        }
      ]
    }).compile();

    service = module.get<GroupService>(GroupService);
    groupModel = module.get<Model<Group>>(getModelToken(Group.name));
    projectModel = module.get<Model<Project>>(getModelToken(Project.name));
    featureModel = module.get<Model<Feature>>(getModelToken(Feature.name));
    projectHelpers = module.get<ProjectHelpers>(ProjectHelpers);
    featureService = module.get<FeatureService>(FeatureService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createGroup', () => {
    it('should successfully create a group with valid data', async () => {
      mockProjectHelpers.checkProjectExists.mockResolvedValue(mockProject);
      mockGroupModel.findOne.mockResolvedValue(null);
      const newGroup = new mockGroupModel(mockGroup);
      newGroup.save.mockResolvedValue(mockGroup);
      mockProjectModel.findByIdAndUpdate.mockResolvedValue(mockProject);

      const result = await service.createGroup(
        mockProject.slug,
        mockGroup.slug,
        mockGroup.name
      );

      expect(result).toEqual(mockGroup);
      expect(mockProjectHelpers.checkProjectExists).toHaveBeenCalledWith(mockProject.slug);
      expect(mockGroupModel.findOne).toHaveBeenCalledWith({
        slug: mockGroup.slug,
        project: mockProject._id
      });
      expect(mockProjectModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockProject._id,
        { $push: { groups: mockGroup._id } },
        { new: true }
      );
    });

    it('should create a group with default name using slug', async () => {
      mockProjectHelpers.checkProjectExists.mockResolvedValue(mockProject);
      mockGroupModel.findOne.mockResolvedValue(null);
      const newGroup = new mockGroupModel(mockGroup);
      newGroup.save.mockResolvedValue(mockGroup);
      mockProjectModel.findByIdAndUpdate.mockResolvedValue(mockProject);

      const result = await service.createGroup(mockProject.slug, mockGroup.slug);

      expect(result).toEqual(mockGroup);
      expect(mockGroup.name).toBe(mockGroup.slug);
    });

    it('should throw BadRequestException when group already exists', async () => {
      mockProjectHelpers.checkProjectExists.mockResolvedValue(mockProject);
      mockGroupModel.findOne.mockResolvedValue(mockGroup);

      await expect(
        service.createGroup(mockProject.slug, mockGroup.slug)
      ).rejects.toThrow(
        new BadRequestException(`Group with slug "${mockGroup.slug}" already exists in project "${mockProject.slug}"`)
      );
    });

    it('should throw NotFoundException when project does not exist', async () => {
      mockProjectHelpers.checkProjectExists.mockRejectedValue(
        new NotFoundException('Project with slug non-existent not found')
      );

      await expect(
        service.createGroup('non-existent', mockGroup.slug)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeGroup', () => {
    it('should successfully remove a group and its features', async () => {
      mockProjectHelpers.checkProjectExists.mockResolvedValue(mockProject);
      mockProjectHelpers.checkFeatureExists.mockResolvedValue(mockFeature);
      mockProjectHelpers.checkGroupExists.mockResolvedValue(mockGroup);
      mockFeatureModel.find.mockResolvedValue([mockFeature]);
      mockFeatureService.removeFeature.mockResolvedValue(mockFeature);
      mockGroupModel.findByIdAndDelete.mockResolvedValue(mockGroup);
      mockProjectModel.findByIdAndUpdate.mockResolvedValue(mockProject);

      const result = await service.removeGroup(mockProject.slug, mockGroup.slug);

      expect(result).toEqual(mockGroup);
      expect(mockFeatureService.removeFeature).toHaveBeenCalledWith(
        mockProject.slug,
        mockGroup.slug,
        mockFeature.slug
      );
      expect(mockGroupModel.findByIdAndDelete).toHaveBeenCalledWith(mockGroup._id);
      expect(mockProjectModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockProject._id,
        { $pull: { groups: mockGroup._id } },
        { new: true }
      );
    });

    it('should throw NotFoundException when project does not exist', async () => {
      mockProjectHelpers.checkProjectExists.mockRejectedValue(
        new NotFoundException('Project with slug non-existent not found')
      );

      await expect(
        service.removeGroup('non-existent', mockGroup.slug)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when group does not exist', async () => {
      mockProjectHelpers.checkProjectExists.mockResolvedValue(mockProject);
      mockProjectHelpers.checkGroupExists.mockRejectedValue(
        new NotFoundException(`Group with slug non-existent not found in project ${mockProject.slug}`)
      );

      await expect(
        service.removeGroup(mockProject.slug, 'non-existent')
      ).rejects.toThrow(NotFoundException);
    });
  });
});
