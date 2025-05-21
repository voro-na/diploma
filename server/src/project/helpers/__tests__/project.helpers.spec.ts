import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectHelpers } from '../project.helpers';
import { Project } from '../../schemas/project.schema';
import { Group } from '../../schemas/group.schema';
import { Feature } from '../../schemas/feature.schema';
import { NotFoundException } from '@nestjs/common';
import {
  mockProject,
  mockGroup,
  mockFeature,
  createMockProjectModel,
  createMockGroupModel,
  createMockFeatureModel
} from '../../__mocks__/test.fixtures';

describe('ProjectHelpers', () => {
  let helpers: ProjectHelpers;
  let projectModel: Model<Project>;
  let groupModel: Model<Group>;
  let featureModel: Model<Feature>;

  let mockProjectModel: ReturnType<typeof createMockProjectModel>;
  let mockGroupModel: ReturnType<typeof createMockGroupModel>;
  let mockFeatureModel: ReturnType<typeof createMockFeatureModel>;

  beforeEach(async () => {
    mockProjectModel = createMockProjectModel();
    mockGroupModel = createMockGroupModel();
    mockFeatureModel = createMockFeatureModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectHelpers,
        {
          provide: getModelToken(Project.name),
          useValue: mockProjectModel
        },
        {
          provide: getModelToken(Group.name),
          useValue: mockGroupModel
        },
        {
          provide: getModelToken(Feature.name),
          useValue: mockFeatureModel
        }
      ]
    }).compile();

    helpers = module.get<ProjectHelpers>(ProjectHelpers);
    projectModel = module.get<Model<Project>>(getModelToken(Project.name));
    groupModel = module.get<Model<Group>>(getModelToken(Group.name));
    featureModel = module.get<Model<Feature>>(getModelToken(Feature.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkProjectExists', () => {
    it('should return project when it exists', async () => {
      mockProjectModel.findOne.mockResolvedValue(mockProject);

      const result = await helpers.checkProjectExists(mockProject.slug);

      expect(result).toEqual(mockProject);
      expect(mockProjectModel.findOne).toHaveBeenCalledWith({ slug: mockProject.slug });
    });

    it('should throw NotFoundException when project does not exist', async () => {
      mockProjectModel.findOne.mockResolvedValue(null);

      await expect(helpers.checkProjectExists('non-existent')).rejects.toThrow(
        new NotFoundException('Project with slug non-existent not found')
      );
    });
  });

  describe('checkGroupExists', () => {
    it('should return group when it exists', async () => {
      mockProjectModel.findOne.mockResolvedValue(mockProject);
      mockGroupModel.findOne.mockResolvedValue(mockGroup);

      const result = await helpers.checkGroupExists(mockProject.slug, mockGroup.slug);

      expect(result).toEqual(mockGroup);
      expect(mockProjectModel.findOne).toHaveBeenCalledWith({ slug: mockProject.slug });
      expect(mockGroupModel.findOne).toHaveBeenCalledWith({
        slug: mockGroup.slug,
        project: mockProject._id
      });
    });

    it('should throw NotFoundException when project does not exist', async () => {
      mockProjectModel.findOne.mockResolvedValue(null);

      await expect(helpers.checkGroupExists('non-existent', mockGroup.slug)).rejects.toThrow(
        new NotFoundException('Project with slug non-existent not found')
      );
    });

    it('should throw NotFoundException when group does not exist', async () => {
      mockProjectModel.findOne.mockResolvedValue(mockProject);
      mockGroupModel.findOne.mockResolvedValue(null);

      await expect(helpers.checkGroupExists(mockProject.slug, 'non-existent')).rejects.toThrow(
        new NotFoundException(`Group with slug non-existent not found in project ${mockProject.slug}`)
      );
    });
  });

  describe('checkFeatureExists', () => {
    it('should return feature when it exists', async () => {
      mockProjectModel.findOne.mockResolvedValue(mockProject);
      mockGroupModel.findOne.mockResolvedValue(mockGroup);
      mockFeatureModel.findOne.mockResolvedValue(mockFeature);

      const result = await helpers.checkFeatureExists(
        mockProject.slug,
        mockGroup.slug,
        mockFeature.slug
      );

      expect(result).toEqual(mockFeature);
      expect(mockProjectModel.findOne).toHaveBeenCalledWith({ slug: mockProject.slug });
      expect(mockGroupModel.findOne).toHaveBeenCalledWith({
        slug: mockGroup.slug,
        project: mockProject._id
      });
      expect(mockFeatureModel.findOne).toHaveBeenCalledWith({
        slug: mockFeature.slug,
        group: mockGroup._id
      });
    });

    it('should throw NotFoundException when project does not exist', async () => {
      mockProjectModel.findOne.mockResolvedValue(null);

      await expect(
        helpers.checkFeatureExists('non-existent', mockGroup.slug, mockFeature.slug)
      ).rejects.toThrow(new NotFoundException('Project with slug non-existent not found'));
    });

    it('should throw NotFoundException when group does not exist', async () => {
      mockProjectModel.findOne.mockResolvedValue(mockProject);
      mockGroupModel.findOne.mockResolvedValue(null);

      await expect(
        helpers.checkFeatureExists(mockProject.slug, 'non-existent', mockFeature.slug)
      ).rejects.toThrow(
        new NotFoundException(`Group with slug non-existent not found in project ${mockProject.slug}`)
      );
    });

    it('should throw NotFoundException when feature does not exist', async () => {
      mockProjectModel.findOne.mockResolvedValue(mockProject);
      mockGroupModel.findOne.mockResolvedValue(mockGroup);
      mockFeatureModel.findOne.mockResolvedValue(null);

      await expect(
        helpers.checkFeatureExists(mockProject.slug, mockGroup.slug, 'non-existent')
      ).rejects.toThrow(
        new NotFoundException(`Feature with slug non-existent not found in group ${mockGroup.slug}`)
      );
    });
  });

  describe('getAllProjectGroups', () => {
    it('should return all groups for a project', async () => {
      const mockGroups = [mockGroup];
      mockGroupModel.find.mockResolvedValue(mockGroups);

      const result = await helpers.getAllProjectGroups(mockProject._id);

      expect(result).toEqual(mockGroups);
      expect(mockGroupModel.find).toHaveBeenCalledWith({
        project: mockProject._id
      });
    });
  });
});
