import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { GroupService } from './services/group.service';
import { FeatureService } from './services/feature.service';
import { TestsService, TestProcessingResult } from './services/tests.service';
import { Project } from './schemas/project.schema';
import { CreateProjectDto } from './dto/project.dto';
import { CreateTestDto, CreateTestGroupDto, EditTestDto, RemoveTestDto, UpdateTestsFromParserDto } from './dto/tests.dto';
import { TestProcessingResultDto } from './dto/response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectService,
    private readonly groupService: GroupService,
    private readonly featureService: FeatureService,
    private readonly testsService: TestsService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project successfully created', type: Project })
  @ApiBody({ type: CreateProjectDto })
  async createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createProject(createProjectDto);
  }

  @Get('/slug/:slug')
  @ApiOperation({ summary: 'Find project by slug' })
  @ApiResponse({ status: 200, description: 'Project found', type: Project })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiParam({ name: 'slug', description: 'Project slug identifier' })
  async findBySlug(@Param('slug') slug: string): Promise<Project> {
    return this.projectsService.findProject(slug);
  }

  @Post(':projectSlug/groups/:groupSlug')
  @ApiOperation({ summary: 'Create a new group in project' })
  @ApiResponse({ status: 201, description: 'Group successfully created' })
  @ApiParam({ name: 'projectSlug', description: 'Project slug identifier' })
  @ApiParam({ name: 'groupSlug', description: 'Group slug identifier' })
  @ApiBody({ schema: { properties: { name: { type: 'string', example: 'Test Group' } } } })
  async createGroup(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Body('name') groupName?: string,
  ) {
    return this.groupService.createGroup(projectSlug, groupSlug, groupName);
  }

  @Post(':projectSlug/groups/:groupSlug/features/:featureSlug')
  @ApiOperation({ summary: 'Create a new feature in group' })
  @ApiResponse({ status: 201, description: 'Feature successfully created' })
  @ApiParam({ name: 'projectSlug', description: 'Project slug identifier' })
  @ApiParam({ name: 'groupSlug', description: 'Group slug identifier' })
  @ApiParam({ name: 'featureSlug', description: 'Feature slug identifier' })
  @ApiBody({ schema: { properties: { name: { type: 'string', example: 'Login Feature' } } } })
  async createFeature(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
    @Body('name') featureName?: string,
  ) {
    return this.featureService.createFeature(projectSlug, groupSlug, featureSlug, featureName);
  }

  @Post(':projectSlug/groups/:groupSlug/features/:featureSlug/tests')
  @ApiOperation({ summary: 'Create a new test group in feature' })
  @ApiResponse({ status: 201, description: 'Test group successfully created' })
  @ApiParam({ name: 'projectSlug', description: 'Project slug identifier' })
  @ApiParam({ name: 'groupSlug', description: 'Group slug identifier' })
  @ApiParam({ name: 'featureSlug', description: 'Feature slug identifier' })
  @ApiBody({ type: CreateTestGroupDto })
  async createTestGroup(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
    @Body() testGroupData: CreateTestGroupDto,
  ) {
    return this.testsService.createTestGroup(projectSlug, groupSlug, featureSlug, testGroupData);
  }

  @Get(':projectSlug/groups/:groupSlug/features/:featureSlug')
  @ApiOperation({ summary: 'Get all test groups in feature' })
  @ApiResponse({ status: 200, description: 'Test groups found' })
  @ApiParam({ name: 'projectSlug', description: 'Project slug identifier' })
  @ApiParam({ name: 'groupSlug', description: 'Group slug identifier' })
  @ApiParam({ name: 'featureSlug', description: 'Feature slug identifier' })
  async getTestGroups(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
  ) {
    return this.testsService.findTests(projectSlug, groupSlug, featureSlug);
  }

  @Delete(':projectSlug/groups/:groupSlug/features/:featureSlug/tests/:testGroupId')
  @ApiOperation({ summary: 'Remove a test group' })
  @ApiResponse({ status: 200, description: 'Test group successfully removed' })
  @ApiParam({ name: 'projectSlug', description: 'Project slug identifier' })
  @ApiParam({ name: 'groupSlug', description: 'Group slug identifier' })
  @ApiParam({ name: 'featureSlug', description: 'Feature slug identifier' })
  @ApiParam({ name: 'testGroupId', description: 'Test group identifier' })
  async removeTestGroup(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
    @Param('testGroupId') testGroupId: string,
  ) {
    return this.testsService.removeTestGroup(projectSlug, groupSlug, featureSlug, testGroupId);
  }

  @Delete(':projectSlug/groups/:groupSlug/features/:featureSlug/tests/:testGroupId/test')
  @ApiOperation({ summary: 'Remove a test from test group' })
  @ApiResponse({ status: 200, description: 'Test successfully removed' })
  @ApiParam({ name: 'projectSlug', description: 'Project slug identifier' })
  @ApiParam({ name: 'groupSlug', description: 'Group slug identifier' })
  @ApiParam({ name: 'featureSlug', description: 'Feature slug identifier' })
  @ApiParam({ name: 'testGroupId', description: 'Test group identifier' })
  @ApiBody({ type: RemoveTestDto })
  async removeTest(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
    @Param('testGroupId') testGroupId: string,
    @Body() removeTestDto: RemoveTestDto,
  ) {
    return this.testsService.removeTest(projectSlug, groupSlug, featureSlug, testGroupId, removeTestDto.testName);
  }

  @Post(':projectSlug/groups/:groupSlug/features/:featureSlug/tests/:testGroupId/test')
  @ApiOperation({ summary: 'Add a new test to test group' })
  @ApiResponse({ status: 201, description: 'Test successfully added' })
  @ApiParam({ name: 'projectSlug', description: 'Project slug identifier' })
  @ApiParam({ name: 'groupSlug', description: 'Group slug identifier' })
  @ApiParam({ name: 'featureSlug', description: 'Feature slug identifier' })
  @ApiParam({ name: 'testGroupId', description: 'Test group identifier' })
  @ApiBody({ type: CreateTestDto })
  async addTest(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
    @Param('testGroupId') testGroupId: string,
    @Body() testData: CreateTestDto,
  ) {
    return this.testsService.addTest(projectSlug, groupSlug, featureSlug, testGroupId, testData);
  }

  @Patch(':projectSlug/groups/:groupSlug/features/:featureSlug/tests/:testGroupId/test')
  @ApiOperation({ summary: 'Edit a test in test group' })
  @ApiResponse({ status: 200, description: 'Test successfully updated' })
  @ApiParam({ name: 'projectSlug', description: 'Project slug identifier' })
  @ApiParam({ name: 'groupSlug', description: 'Group slug identifier' })
  @ApiParam({ name: 'featureSlug', description: 'Feature slug identifier' })
  @ApiParam({ name: 'testGroupId', description: 'Test group identifier' })
  @ApiBody({ type: EditTestDto })
  async editTest(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
    @Param('testGroupId') testGroupId: string,
    @Body() editTestDto: EditTestDto,
  ) {
    return this.testsService.editTest(
      projectSlug, 
      groupSlug, 
      featureSlug, 
      testGroupId, 
      editTestDto.testName, 
      editTestDto.newData
    );
  }


  @Delete(':projectSlug/groups/:groupSlug/features/:featureSlug')
  @ApiOperation({ summary: 'Remove a feature' })
  @ApiResponse({ status: 200, description: 'Feature successfully removed' })
  @ApiParam({ name: 'projectSlug', description: 'Project slug identifier' })
  @ApiParam({ name: 'groupSlug', description: 'Group slug identifier' })
  @ApiParam({ name: 'featureSlug', description: 'Feature slug identifier' })
  async removeFeature(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
  ) {
    return this.featureService.removeFeature(projectSlug, groupSlug, featureSlug);
  }

  @Delete(':projectSlug/groups/:groupSlug')
  @ApiOperation({ summary: 'Remove a group' })
  @ApiResponse({ status: 200, description: 'Group successfully removed' })
  @ApiParam({ name: 'projectSlug', description: 'Project slug identifier' })
  @ApiParam({ name: 'groupSlug', description: 'Group slug identifier' })
  async removeGroup(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
  ) {
    return this.groupService.removeGroup(projectSlug, groupSlug);
  }

  @Post(':projectSlug/tests/update')
  @ApiOperation({ summary: 'Update tests from parser results' })
  @ApiResponse({ status: 200, description: 'Tests successfully updated', type: [TestProcessingResultDto] })
  @ApiParam({ name: 'projectSlug', description: 'Project slug identifier' })
  @ApiBody({ type: UpdateTestsFromParserDto })
  async updateTestsFromParser(
    @Param('projectSlug') projectSlug: string,
    @Body() updateDto: UpdateTestsFromParserDto,
  ): Promise<TestProcessingResult[]> {
    return this.testsService.updateTestsFromParser(projectSlug, updateDto.tests);
  }
}
