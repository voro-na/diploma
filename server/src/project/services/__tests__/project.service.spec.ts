import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectService } from '../project.service';
import { Project } from '../../schemas/project.schema';
import { CreateProjectDto } from '../../dto/project.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mockProject, createMockProjectModel } from '../../__mocks__/test.fixtures';

describe('ProjectService', () => {
  let service: ProjectService;
  let mockProjectModel: ReturnType<typeof createMockProjectModel>;

  beforeEach(async () => {
    mockProjectModel = createMockProjectModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getModelToken(Project.name),
          useValue: mockProjectModel
        }
      ]
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('should successfully create a project', async () => {
      const dto: CreateProjectDto = {
        slug: mockProject.slug,
        name: mockProject.name,
        description: mockProject.description
      };

      mockProjectModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      });

      const result = await service.createProject(dto);

      const newProject = new mockProjectModel(dto);
      expect(result).toEqual(mockProject);
      expect(mockProjectModel.findOne).toHaveBeenCalledWith({ slug: dto.slug });
      expect(mockProjectModel).toHaveBeenCalledWith(dto);
      expect(newProject.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException when slug is missing', async () => {
      const dto: CreateProjectDto = {
        name: mockProject.name,
        description: mockProject.description
      } as CreateProjectDto;

      await expect(service.createProject(dto)).rejects.toThrow(
        new BadRequestException('Project slug is required')
      );
    });

    it('should throw BadRequestException when name is missing', async () => {
      const dto: CreateProjectDto = {
        slug: mockProject.slug,
        description: mockProject.description
      } as CreateProjectDto;

      await expect(service.createProject(dto)).rejects.toThrow(
        new BadRequestException('Project name is required')
      );
    });

    it('should throw BadRequestException when project with slug already exists', async () => {
      const dto: CreateProjectDto = {
        slug: 'existing-project',
        name: mockProject.name,
        description: mockProject.description
      };

      mockProjectModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ slug: 'existing-project' })
      });

      await expect(service.createProject(dto)).rejects.toThrow(
        new BadRequestException('Project with slug "existing-project" already exists')
      );
    });
  });

  describe('findProject', () => {
    it('should successfully find and populate a project', async () => {
      const populatedProject = {
        ...mockProject,
        groups: [
          {
            slug: 'test-group',
            name: 'Test Group',
            features: []
          }
        ]
      };

      mockProjectModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(populatedProject)
        })
      });

      const result = await service.findProject(mockProject.slug);

      expect(result).toEqual(populatedProject);
      expect(mockProjectModel.findOne).toHaveBeenCalledWith({ slug: mockProject.slug });
    });

    it('should throw NotFoundException when project not found', async () => {
      mockProjectModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null)
        })
      });

      await expect(service.findProject('non-existent')).rejects.toThrow(
        new NotFoundException('Project with slug non-existent not found')
      );
    });
  });
});
