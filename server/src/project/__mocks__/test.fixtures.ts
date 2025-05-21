import { Types } from 'mongoose';
import { Status } from '../schemas/tests.schema';
import { CreateTestDto, CreateTestGroupDto } from '../dto/tests.dto';

// Mock IDs
export const mockIds = {
  project: 'project-id',
  group: 'group-id',
  feature: 'feature-id',
  testGroup: 'test-group-1',
  testGroup2: 'test-group-2'
};

// Mock Project
export const mockProject = {
  _id: mockIds.project,
  slug: 'test-project',
  name: 'Test Project',
  description: 'Test Description',
  groups: []
};

// Mock Group
export const mockGroup = {
  _id: mockIds.group,
  slug: 'test-group',
  name: 'Test Group',
  description: 'Test Description',
  project: mockIds.project,
  features: []
};

// Mock Feature
export const mockFeature = {
  _id: mockIds.feature,
  slug: 'test-feature',
  name: 'Test Feature',
  description: 'Test Description',
  group: mockIds.group,
  testGroup: [mockIds.testGroup, mockIds.testGroup2],
  allTestCount: 2,
  passTestCount: 1
};

// Mock Test
export const mockTest = {
  name: 'Test 1',
  description: 'Test description',
  status: 'PASSED' as Status
};

// Mock Test Group
export const mockTestGroup = {
  _id: mockIds.testGroup,
  name: 'Test Group 1',
  tests: [
    mockTest,
    {
      name: 'Test 2',
      description: 'Test description',
      status: 'FAILED' as Status
    }
  ],
  feature: mockIds.feature
};

// Mock DTOs
export const mockCreateTestDto: CreateTestDto = {
  name: 'New Test',
  status: 'PASSED',
  description: 'New test description'
};

export const mockCreateTestGroupDto: CreateTestGroupDto = {
  name: 'Test Group 1',  // Match the name in mockTestGroup
  tests: [
    {
      name: 'Test 1',
      status: 'PASSED',
      description: 'Test description'
    },
    {
      name: 'Test 2',
      status: 'FAILED',
      description: 'Test description'
    }
  ]  // Match the tests in mockTestGroup
};

// Mock Parser Tests
export const mockParserTests = [
  {
    featureName: 'Test Feature',
    testGroupName: 'Test Group 1',
    testName: 'Test 1',
    status: 'passed'
  }
];

// Mock Models
export const createMockProjectModel = () => {
  class MockProjectModel {
    save: jest.Mock;
    [key: string]: any;

    constructor(data: any) {
      Object.assign(this, data);
      this.save = jest.fn().mockImplementation(() => {
        const { save, ...projectData } = this;
        return Promise.resolve(projectData);
      });
    }
  }

  type MockModel = {
    new(data: any): MockProjectModel;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    exec: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    find: jest.Mock;
    findById: jest.Mock;
    findByIdAndDelete: jest.Mock;
    new: jest.Mock;
  } & jest.Mock;

  const mockModel = jest.fn().mockImplementation((data) => new MockProjectModel(data)) as MockModel;
  
  Object.assign(mockModel, {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    new: jest.fn().mockImplementation((data) => new MockProjectModel(data))
  });
  
  return mockModel;
};

export const createMockGroupModel = () => {
  class MockGroupModel {
    save: jest.Mock;
    [key: string]: any;

    constructor(data: any) {
      Object.assign(this, data);
      this.save = jest.fn().mockImplementation(() => {
        // Return a plain object without the save method
        const { save, ...groupData } = this;
        return Promise.resolve(groupData);
      });
    }
  }

  type MockModel = {
    new(data: any): MockGroupModel;
    findOne: jest.Mock;
    findByIdAndDelete: jest.Mock;
    find: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findById: jest.Mock;
    save: jest.Mock;
    new: jest.Mock;
  } & jest.Mock;

  const mockModel = jest.fn().mockImplementation((data) => new MockGroupModel(data)) as MockModel;
  
  Object.assign(mockModel, {
    findOne: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    new: jest.fn().mockImplementation((data) => new MockGroupModel(data))
  });
  
  return mockModel;
};

export const createMockFeatureModel = () => {
  class MockFeatureModel {
    save: jest.Mock;
    [key: string]: any;

    constructor(data: any) {
      Object.assign(this, data);
      this.save = jest.fn().mockImplementation(() => {
        const { save, ...featureData } = this;
        return Promise.resolve(featureData);
      });
    }
  }

  type MockModel = {
    new(data: any): MockFeatureModel;
    findOne: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
    find: jest.Mock;
    save: jest.Mock;
    new: jest.Mock;
  } & jest.Mock;

  const mockModel = jest.fn().mockImplementation((data) => new MockFeatureModel(data)) as MockModel;
  
  Object.assign(mockModel, {
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    new: jest.fn().mockImplementation((data) => new MockFeatureModel(data))
  });
  
  return mockModel;
};

export const createMockTestsModel = () => {
  class MockTestsModel {
    save: jest.Mock;
    [key: string]: any;

    constructor(data: any) {
      Object.assign(this, data);
      this.save = jest.fn().mockImplementation(() => {
        const { save, ...testData } = this;
        return Promise.resolve(testData);
      });
    }
  }

  type MockModel = {
    new(data: any): MockTestsModel;
    findById: jest.Mock;
    findOne: jest.Mock;
    find: jest.Mock;
    findByIdAndDelete: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    save: jest.Mock;
    new: jest.Mock;
  } & jest.Mock;

  const mockModel = jest.fn().mockImplementation((data) => new MockTestsModel(data)) as MockModel;
  
  Object.assign(mockModel, {
    findById: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    save: jest.fn(),
    new: jest.fn().mockImplementation((data) => new MockTestsModel(data))
  });
  
  return mockModel;
};

// Mock Helpers
export const createMockProjectHelpers = () => ({
  checkProjectExists: jest.fn(),
  checkGroupExists: jest.fn(),
  checkFeatureExists: jest.fn(),
  getAllProjectGroups: jest.fn()
});

// Mock Services
export const createMockFeatureService = () => ({
  removeFeature: jest.fn()
});

export const createMockTestsService = () => ({
  removeTestGroup: jest.fn()
});
