import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeatureService } from '../feature.service';
import { Feature } from '../../schemas/feature.schema';
import { Group } from '../../schemas/group.schema';
import { ProjectHelpers } from '../../helpers/project.helpers';
import { TestsService } from '../tests.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  mockProject,
  mockGroup,
  mockFeature,
  createMockFeatureModel,
  createMockGroupModel,
  createMockProjectHelpers,
  createMockTestsService
} from '../../__mocks__/test.fixtures';

describe('FeatureService', () => {
  let service: FeatureService;
  let featureModel: Model<Feature>;
  let groupModel: Model<Group>;
  let projectHelpers: ProjectHelpers;
  let testsService: TestsService;

  let mockFeatureModel: ReturnType<typeof createMockFeatureModel>;
  let mockGroupModel: ReturnType<typeof createMockGroupModel>;
  let mockProjectHelpers: ReturnType<typeof createMockProjectHelpers>;
  let mockTestsService: ReturnType<typeof createMockTestsService>;

  beforeEach(async () => {
    mockFeatureModel = createMockFeatureModel();
    mockGroupModel = createMockGroupModel();
    mockProjectHelpers = createMockProjectHelpers();
    mockTestsService = createMockTestsService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureService,
        {
          provide: getModelToken(Feature.name),
          useValue: mockFeatureModel
        },
        {
          provide: getModelToken(Group.name),
          useValue: mockGroupModel
        },
        {
          provide: ProjectHelpers,
          useValue: mockProjectHelpers
        },
        {
          provide: TestsService,
          useValue: mockTestsService
        }
      ]
    }).compile();

    service = module.get<FeatureService>(FeatureService);
    featureModel = module.get<Model<Feature>>(getModelToken(Feature.name));
    groupModel = module.get<Model<Group>>(getModelToken(Group.name));
    projectHelpers = module.get<ProjectHelpers>(ProjectHelpers);
    testsService = module.get<TestsService>(TestsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFeature', () => {
    it('should successfully create a feature with valid data', async () => {
      mockProjectHelpers.checkGroupExists.mockResolvedValue(mockGroup);
      mockFeatureModel.findOne.mockResolvedValue(null);
      const newFeature = new mockFeatureModel({
        slug: mockFeature.slug,
        name: mockFeature.name,
        group: mockGroup._id
      });
      mockGroupModel.findByIdAndUpdate.mockResolvedValue(mockGroup);

      const result = await service.createFeature(
        mockProject.slug,
        mockGroup.slug,
        mockFeature.slug,
        mockFeature.name
      );

      expect(result).toEqual(mockFeature);
      expect(mockFeatureModel).toHaveBeenCalledWith({
        slug: mockFeature.slug,
        name: mockFeature.name,
        group: mockGroup._id
      });
      expect(newFeature.save).toHaveBeenCalled();
      expect(mockProjectHelpers.checkGroupExists).toHaveBeenCalledWith(
        mockProject.slug,
        mockGroup.slug
      );
      expect(mockFeatureModel.findOne).toHaveBeenCalledWith({
        slug: mockFeature.slug,
        group: mockGroup._id
      });
      expect(mockGroupModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockGroup._id,
        { $push: { features: mockFeature._id } },
        { new: true }
      );
    });

    it('should create a feature with default name using slug', async () => {
      mockProjectHelpers.checkGroupExists.mockResolvedValue(mockGroup);
      mockFeatureModel.findOne.mockResolvedValue(null);
      const newFeature = new mockFeatureModel({
        slug: mockFeature.slug,
        name: mockFeature.slug,
        group: mockGroup._id
      });
      mockGroupModel.findByIdAndUpdate.mockResolvedValue(mockGroup);

      const result = await service.createFeature(
        mockProject.slug,
        mockGroup.slug,
        mockFeature.slug
      );

      expect(result).toEqual(mockFeature);
      expect(mockFeatureModel).toHaveBeenCalledWith({
        slug: mockFeature.slug,
        name: mockFeature.slug,
        group: mockGroup._id
      });
      expect(newFeature.save).toHaveBeenCalled();
      expect(mockFeature.name).toBe(mockFeature.slug);
    });

    it('should throw BadRequestException when feature already exists', async () => {
      mockProjectHelpers.checkGroupExists.mockResolvedValue(mockGroup);
      mockFeatureModel.findOne.mockResolvedValue(mockFeature);

      await expect(
        service.createFeature(mockProject.slug, mockGroup.slug, mockFeature.slug)
      ).rejects.toThrow(
        new BadRequestException(`Feature with slug "${mockFeature.slug}" already exists in group "${mockGroup.slug}"`)
      );
    });

    it('should throw NotFoundException when group does not exist', async () => {
      mockProjectHelpers.checkGroupExists.mockRejectedValue(
        new NotFoundException(`Group with slug non-existent not found in project ${mockProject.slug}`)
      );

      await expect(
        service.createFeature(mockProject.slug, 'non-existent', mockFeature.slug)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFeature', () => {
    it('should successfully remove a feature without test groups', async () => {
      const featureWithoutTests = { ...mockFeature, testGroup: [] };
      mockProjectHelpers.checkFeatureExists.mockResolvedValue(featureWithoutTests);
      mockProjectHelpers.checkGroupExists.mockResolvedValue(mockGroup);
      mockFeatureModel.findByIdAndDelete.mockResolvedValue(featureWithoutTests);
      mockGroupModel.findByIdAndUpdate.mockResolvedValue(mockGroup);

      const result = await service.removeFeature(
        mockProject.slug,
        mockGroup.slug,
        mockFeature.slug
      );

      expect(result).toEqual(featureWithoutTests);
      expect(testsService.removeTestGroup).not.toHaveBeenCalled();
      expect(mockFeatureModel.findByIdAndDelete).toHaveBeenCalledWith(mockFeature._id);
      expect(mockGroupModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockGroup._id,
        { $pull: { features: mockFeature._id } },
        { new: true }
      );
    });

    it('should successfully remove a feature with test groups', async () => {
      mockProjectHelpers.checkFeatureExists.mockResolvedValue(mockFeature);
      mockProjectHelpers.checkGroupExists.mockResolvedValue(mockGroup);
      mockFeatureModel.findByIdAndDelete.mockResolvedValue(mockFeature);
      mockGroupModel.findByIdAndUpdate.mockResolvedValue(mockGroup);

      const result = await service.removeFeature(
        mockProject.slug,
        mockGroup.slug,
        mockFeature.slug
      );

      expect(result).toEqual(mockFeature);
      expect(testsService.removeTestGroup).toHaveBeenCalledTimes(2);
      mockFeature.testGroup.forEach(testGroupId => {
        expect(testsService.removeTestGroup).toHaveBeenCalledWith(
          mockProject.slug,
          mockGroup.slug,
          mockFeature.slug,
          testGroupId.toString()
        );
      });
      expect(mockFeatureModel.findByIdAndDelete).toHaveBeenCalledWith(mockFeature._id);
      expect(mockGroupModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockGroup._id,
        { $pull: { features: mockFeature._id } },
        { new: true }
      );
    });

    it('should throw NotFoundException when feature does not exist', async () => {
      mockProjectHelpers.checkFeatureExists.mockRejectedValue(
        new NotFoundException(`Feature with slug non-existent not found in group ${mockGroup.slug}`)
      );

      await expect(
        service.removeFeature(mockProject.slug, mockGroup.slug, 'non-existent')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when group does not exist', async () => {
      mockProjectHelpers.checkFeatureExists.mockResolvedValue(mockFeature);
      mockProjectHelpers.checkGroupExists.mockRejectedValue(
        new NotFoundException(`Group with slug non-existent not found in project ${mockProject.slug}`)
      );

      await expect(
        service.removeFeature(mockProject.slug, 'non-existent', mockFeature.slug)
      ).rejects.toThrow(NotFoundException);
    });
  });
});
