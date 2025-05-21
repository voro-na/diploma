import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TestsService } from '../tests.service';
import { TestGroup } from '../../schemas/tests.schema';
import { Feature } from '../../schemas/feature.schema';
import { Group } from '../../schemas/group.schema';
import { ProjectHelpers } from '../../helpers/project.helpers';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  mockProject,
  mockGroup,
  mockFeature,
  mockTestGroup,
  mockCreateTestDto,
  mockCreateTestGroupDto,
  mockParserTests,
  createMockTestsModel,
  createMockFeatureModel,
  createMockGroupModel,
  createMockProjectHelpers
} from '../../__mocks__/test.fixtures';

describe('TestsService', () => {
  let service: TestsService;
  let testsModel: Model<TestGroup>;
  let featureModel: Model<Feature>;
  let groupModel: Model<Group>;
  let projectHelpers: ProjectHelpers;

  let mockTestsModel: ReturnType<typeof createMockTestsModel>;
  let mockFeatureModel: ReturnType<typeof createMockFeatureModel>;
  let mockGroupModel: ReturnType<typeof createMockGroupModel>;
  let mockProjectHelpers: ReturnType<typeof createMockProjectHelpers>;

  beforeEach(async () => {
    mockTestsModel = createMockTestsModel();
    mockFeatureModel = createMockFeatureModel();
    mockGroupModel = createMockGroupModel();
    mockProjectHelpers = createMockProjectHelpers();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestsService,
        {
          provide: getModelToken(TestGroup.name),
          useValue: mockTestsModel
        },
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
        }
      ]
    }).compile();

    service = module.get<TestsService>(TestsService);
    testsModel = module.get<Model<TestGroup>>(getModelToken(TestGroup.name));
    featureModel = module.get<Model<Feature>>(getModelToken(Feature.name));
    groupModel = module.get<Model<Group>>(getModelToken(Group.name));
    projectHelpers = module.get<ProjectHelpers>(ProjectHelpers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTestGroup', () => {
    it('should successfully create a test group', async () => {
      mockProjectHelpers.checkFeatureExists.mockResolvedValue(mockFeature);
      const newTestGroup = new mockTestsModel({
        name: mockCreateTestGroupDto.name,
        tests: mockCreateTestGroupDto.tests,
        feature: mockFeature._id
      });
      mockFeatureModel.findByIdAndUpdate.mockResolvedValue(mockFeature);

      const result = await service.createTestGroup(
        mockProject.slug,
        mockGroup.slug,
        mockFeature.slug,
        mockCreateTestGroupDto
      );

      expect(mockTestsModel).toHaveBeenCalledWith({
        name: mockCreateTestGroupDto.name,
        tests: mockCreateTestGroupDto.tests,
        feature: mockFeature._id
      });
      expect(newTestGroup.save).toHaveBeenCalled();
      expect(mockProjectHelpers.checkFeatureExists).toHaveBeenCalledWith(
        mockProject.slug,
        mockGroup.slug,
        mockFeature.slug
      );
      expect(mockFeatureModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockFeature._id,
        {
          $push: { testGroup: mockTestGroup._id },
          $inc: { allTestCount: 1, passTestCount: 1 }
        },
        { new: true }
      );
    });

    it('should throw NotFoundException when feature does not exist', async () => {
      mockProjectHelpers.checkFeatureExists.mockRejectedValue(
        new NotFoundException(`Feature with slug non-existent not found in group ${mockGroup.slug}`)
      );

      await expect(
        service.createTestGroup(mockProject.slug, mockGroup.slug, 'non-existent', mockCreateTestGroupDto)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findTests', () => {
    it('should successfully find tests for a feature', async () => {
      mockProjectHelpers.checkFeatureExists.mockResolvedValue(mockFeature);
      mockTestsModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockTestGroup])
      });

      const result = await service.findTests(
        mockProject.slug,
        mockGroup.slug,
        mockFeature.slug
      );

      expect(result).toEqual({
        info: mockFeature,
        tests: [mockTestGroup]
      });
      expect(mockProjectHelpers.checkFeatureExists).toHaveBeenCalledWith(
        mockProject.slug,
        mockGroup.slug,
        mockFeature.slug
      );
      expect(mockTestsModel.find).toHaveBeenCalledWith({
        _id: { $in: mockFeature.testGroup }
      });
    });

    it('should throw NotFoundException when feature does not exist', async () => {
      mockProjectHelpers.checkFeatureExists.mockRejectedValue(
        new NotFoundException(`Feature with slug non-existent not found in group ${mockGroup.slug}`)
      );

      await expect(
        service.findTests(mockProject.slug, mockGroup.slug, 'non-existent')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeTestGroup', () => {
    it('should successfully remove a test group', async () => {
      mockProjectHelpers.checkFeatureExists.mockResolvedValue(mockFeature);
      mockTestsModel.findById.mockResolvedValue(mockTestGroup);
      mockTestsModel.findByIdAndDelete.mockResolvedValue(mockTestGroup);
      mockFeatureModel.findByIdAndUpdate.mockResolvedValue(mockFeature);

      const result = await service.removeTestGroup(
        mockProject.slug,
        mockGroup.slug,
        mockFeature.slug,
        mockTestGroup._id
      );

      expect(result).toEqual(mockFeature);
      expect(mockFeatureModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockFeature._id,
        {
          $pull: { testGroup: mockTestGroup._id },
          $inc: { allTestCount: -2, passTestCount: -1 }
        },
        { new: true }
      );
    });

    it('should throw NotFoundException when test group does not exist', async () => {
      mockProjectHelpers.checkFeatureExists.mockResolvedValue(mockFeature);
      mockTestsModel.findById.mockResolvedValue(null);

      await expect(
        service.removeTestGroup(mockProject.slug, mockGroup.slug, mockFeature.slug, 'non-existent')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when test group does not belong to feature', async () => {
      const featureWithoutTestGroup = { ...mockFeature, testGroup: ['other-group'] };
      mockProjectHelpers.checkFeatureExists.mockResolvedValue(featureWithoutTestGroup);
      mockTestsModel.findById.mockResolvedValue(mockTestGroup);

      await expect(
        service.removeTestGroup(mockProject.slug, mockGroup.slug, mockFeature.slug, mockTestGroup._id)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateTestsFromParser', () => {
    it('should successfully update tests from parser', async () => {
      mockProjectHelpers.checkProjectExists.mockResolvedValue(mockProject);
      mockFeatureModel.findOne.mockResolvedValue(mockFeature);
      mockGroupModel.findById.mockResolvedValue(mockGroup);
      mockTestsModel.find.mockResolvedValue([mockTestGroup]);

      const results = await service.updateTestsFromParser(mockProject.slug, mockParserTests);

      expect(results).toEqual([
        {
          testName: mockParserTests[0].testName,
          status: 'success'
        }
      ]);
    });

    it('should handle feature not found error', async () => {
      mockProjectHelpers.checkProjectExists.mockResolvedValue(mockProject);
      mockFeatureModel.findOne.mockResolvedValue(null);

      const results = await service.updateTestsFromParser(mockProject.slug, mockParserTests);

      expect(results).toEqual([
        {
          testName: mockParserTests[0].testName,
          status: 'error',
          error: `Feature "${mockParserTests[0].featureName}" not found in project "${mockProject.slug}"`
        }
      ]);
    });

    it('should handle group not found error', async () => {
      mockProjectHelpers.checkProjectExists.mockResolvedValue(mockProject);
      mockFeatureModel.findOne.mockResolvedValue(mockFeature);
      mockGroupModel.findById.mockResolvedValue(null);

      const results = await service.updateTestsFromParser(mockProject.slug, mockParserTests);

      expect(results).toEqual([
        {
          testName: mockParserTests[0].testName,
          status: 'error',
          error: `Group not found for feature "${mockParserTests[0].featureName}"`
        }
      ]);
    });
  });
});
