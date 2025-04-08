import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { GroupService } from './services/group.service';
import { FeatureService } from './services/feature.service';
import { TestsService } from './services/tests.service';
import { Project } from './schemas/project.schema';
import { CreateProjectDto } from './dto/project.dto';
import { CreateTestGroupDto } from './dto/tests.dto';
import { RemoveTestDto } from './dto/tests.dto';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectService,
    private readonly groupService: GroupService,
    private readonly featureService: FeatureService,
    private readonly testsService: TestsService,
  ) { }

  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createProject(createProjectDto);
  }

  @Get('/slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<Project> {
    return this.projectsService.findProject(slug);
  }

  @Post(':projectSlug/groups/:groupSlug')
  async createGroup(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Body('name') groupName?: string,
  ) {
    return this.groupService.createGroup(projectSlug, groupSlug, groupName);
  }

  @Post(':projectSlug/groups/:groupSlug/features/:featureSlug')
  async createFeature(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
    @Body('name') featureName?: string,
  ) {
    return this.featureService.createFeature(projectSlug, groupSlug, featureSlug, featureName);
  }

  @Post(':projectSlug/groups/:groupSlug/features/:featureSlug/tests')
  async createTestGroup(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
    @Body() testGroupData: CreateTestGroupDto,
  ) {
    return this.testsService.createTestGroup(projectSlug, groupSlug, featureSlug, testGroupData);
  }

  @Get(':projectSlug/groups/:groupSlug/features/:featureSlug')
  async getTestGroups(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
  ) {
    return this.testsService.findTests(projectSlug, groupSlug, featureSlug);
  }

  @Delete(':projectSlug/groups/:groupSlug/features/:featureSlug/tests/:testGroupId')
  async removeTestGroup(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
    @Param('testGroupId') testGroupId: string,
  ) {
    return this.testsService.removeTestGroup(projectSlug, groupSlug, featureSlug, testGroupId);
  }

  @Delete(':projectSlug/groups/:groupSlug/features/:featureSlug/tests/:testGroupId/test')
  async removeTest(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
    @Param('testGroupId') testGroupId: string,
    @Body() removeTestDto: RemoveTestDto,
  ) {
    return this.testsService.removeTest(projectSlug, groupSlug, featureSlug, testGroupId, removeTestDto.testName);
  }


  @Delete(':projectSlug/groups/:groupSlug/features/:featureSlug')
  async removeFeature(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
  ) {
    return this.featureService.removeFeature(projectSlug, groupSlug, featureSlug);
  }

  // @Post(':projectSlug/groups/:groupSlug/features/:featureSlug')
  // async addTests(
  //   @Param('projectSlug') projectSlug: string,
  //   @Param('groupSlug') groupSlug: string,
  //   @Param('featureSlug') featureSlug: string,
  //   @Body() createTestsDto: CreateTestGroupDto[],
  // ) {
  //   return this.projectsService.addTests(
  //     projectSlug,
  //     groupSlug,
  //     featureSlug,
  //     createTestsDto,
  //   );
  // }

  // @Post(':projectSlug/upload')
  // async uploadReport(
  //   @Param('projectSlug') projectSlug: string,
  //   @Body() body: CreateReportDto[],
  // ) {
  //   for (const report of body) {
  //     await this.projectsService.addTests(
  //       projectSlug,
  //       report.groupSlug,
  //       report.featureSlug,
  //       report.report,
  //     );
  //   }
  // }
}
