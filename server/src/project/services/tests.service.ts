import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Status, Test, TestGroup } from '../schemas/tests.schema';
import { Feature } from '../schemas/feature.schema';
import { ProjectHelpers } from '../helpers/project.helpers';
import { CreateTestDto, CreateTestGroupDto } from '../dto/tests.dto';

@Injectable()
export class TestsService {
    constructor(
        @InjectModel(TestGroup.name) private testsModel: Model<TestGroup>,
        @InjectModel(Feature.name) private featureModel: Model<Feature>,
        private projectHelpers: ProjectHelpers,
    ) { }

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

        const allTestCount = testGroupData.tests.length;
        const passTestCount = testGroupData.tests.filter(test => test.status === 'PASSED').length;

        await this.featureModel.findByIdAndUpdate(
            feature._id,
            { 
                $push: { testGroup: testGroup._id },
                $inc: { 
                    allTestCount: allTestCount,
                    passTestCount: passTestCount
                }
            },
            { new: true }
        );

        return testGroup;
    }

    /**
     * Finds tests for a feature
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

        const allTestCount = testGroup.tests.length;
        const passTestCount = testGroup.tests.filter(test => test.status === 'PASSED').length;

        await this.testsModel.findByIdAndDelete(testGroupId);

        const updatedFeature = await this.featureModel.findByIdAndUpdate(
            feature._id,
            {
                $pull: { testGroup: testGroupId },
                $inc: { 
                    allTestCount: -allTestCount,
                    passTestCount: -passTestCount
                }
            },
            { new: true }
        );

        return updatedFeature;
    }

    /**
     * Removes a single test from a test group
     * @param projectSlug The slug of the project
     * @param groupSlug The slug of the group
     * @param featureSlug The slug of the feature
     * @param testGroupId The ID of the test group
     * @param testName The name of the test to remove
     * @returns The updated test group
     */
    async removeTest(
        projectSlug: string,
        groupSlug: string,
        featureSlug: string,
        testGroupId: string,
        testName: string,
    ): Promise<TestGroup> {
        const feature = await this.projectHelpers.checkFeatureExists(projectSlug, groupSlug, featureSlug);

        const testGroup = await this.testsModel.findById(testGroupId);
        if (!testGroup) {
            throw new NotFoundException(`Test group with ID ${testGroupId} not found`);
        }

        if (!feature.testGroup.includes(testGroup._id)) {
            throw new BadRequestException(`Test group with ID ${testGroupId} does not belong to feature ${featureSlug}`);
        }

        const testIndex = testGroup.tests.findIndex(test => test.name === testName);
        if (testIndex === -1) {
            throw new NotFoundException(`Test with name "${testName}" not found in test group`);
        }

        const isPassingTest = testGroup.tests[testIndex].status === 'PASSED';
        
        testGroup.tests.splice(testIndex, 1);
        await testGroup.save();

        await this.featureModel.findByIdAndUpdate(
            feature._id,
            {
                $inc: { 
                    allTestCount: -1,
                    passTestCount: isPassingTest ? -1 : 0
                }
            },
            { new: true }
        );

        return testGroup;
    }

    /**
     * Adds a single test to an existing test group
     * @param projectSlug The slug of the project
     * @param groupSlug The slug of the group
     * @param featureSlug The slug of the feature
     * @param testGroupId The ID of the test group
     * @param testData The data for the new test
     * @returns The updated test group
     */
    async addTest(
        projectSlug: string,
        groupSlug: string,
        featureSlug: string,
        testGroupId: string,
        testData: CreateTestDto,
    ): Promise<TestGroup> {
        const feature = await this.projectHelpers.checkFeatureExists(projectSlug, groupSlug, featureSlug);

        const testGroup = await this.testsModel.findById(testGroupId);
        if (!testGroup) {
            throw new NotFoundException(`Test group with ID ${testGroupId} not found`);
        }

        if (!feature.testGroup.includes(testGroup._id)) {
            throw new BadRequestException(`Test group with ID ${testGroupId} does not belong to feature ${featureSlug}`);
        }
        
        const newTest: Test = {
            name: testData.name,
            description: testData.description,
            link: testData.link,
            status: testData.status as Status
        };

        testGroup.tests.push(newTest);
        await testGroup.save();

        const isPassingTest = testData.status === 'PASSED';
        
        await this.featureModel.findByIdAndUpdate(
            feature._id,
            {
                $inc: { 
                    allTestCount: 1,
                    passTestCount: isPassingTest ? 1 : 0
                }
            },
            { new: true }
        );

        return testGroup;
    }

    /**
     * Edits an existing test in a test group
     * @param projectSlug The slug of the project
     * @param groupSlug The slug of the group
     * @param featureSlug The slug of the feature
     * @param testGroupId The ID of the test group
     * @param testName The name of the test to edit
     * @param testData The updated test data
     * @returns The updated test group
     */
    async editTest(
        projectSlug: string,
        groupSlug: string,
        featureSlug: string,
        testGroupId: string,
        testName: string,
        testData: CreateTestDto,
    ): Promise<TestGroup> {
        const feature = await this.projectHelpers.checkFeatureExists(projectSlug, groupSlug, featureSlug);

        const testGroup = await this.testsModel.findById(testGroupId);
        if (!testGroup) {
            throw new NotFoundException(`Test group with ID ${testGroupId} not found`);
        }

        if (!feature.testGroup.includes(testGroup._id)) {
            throw new BadRequestException(`Test group with ID ${testGroupId} does not belong to feature ${featureSlug}`);
        }

        const testIndex = testGroup.tests.findIndex(test => test.name === testName);
        if (testIndex === -1) {
            throw new NotFoundException(`Test with name "${testName}" not found in test group`);
        }

        const oldStatus = testGroup.tests[testIndex].status;
        const newStatus = testData.status as Status;
        
        const updatedTest: Test = {
            name: testData.name,
            description: testData.description,
            link: testData.link,
            status: newStatus
        };
        
        testGroup.tests[testIndex] = updatedTest;
        await testGroup.save();

        if (oldStatus !== newStatus) {
            const passCountDelta = 
                (oldStatus === 'PASSED' ? -1 : 0) + 
                (newStatus === 'PASSED' ? 1 : 0);
            
            if (passCountDelta !== 0) {
                await this.featureModel.findByIdAndUpdate(
                    feature._id,
                    {
                        $inc: { 
                            passTestCount: passCountDelta
                        }
                    },
                    { new: true }
                );
            }
        }

        return testGroup;
    }
}
