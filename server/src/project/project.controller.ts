import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { GroupService } from './services/group.service';
import { FeatureService } from './services/feature.service';
import { Project } from './schemas/project.schema';
import { CreateProjectDto } from './dto/project.dto';
import { CreateTestGroupDto } from './dto/tests.dto';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectService,
    private readonly groupService: GroupService,
    private readonly featureService: FeatureService,
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
    return this.projectsService.createTestGroup(projectSlug, groupSlug, featureSlug, testGroupData);
  }

  @Get(':projectSlug/groups/:groupSlug/features/:featureSlug')
  async getTestGroups(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
  ) {
    return this.projectsService.findTests(projectSlug, groupSlug, featureSlug);
  }

  @Delete(':projectSlug/groups/:groupSlug/features/:featureSlug/tests/:testGroupId')
  async removeTestGroup(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
    @Param('testGroupId') testGroupId: string,
  ) {
    return this.projectsService.removeTestGroup(projectSlug, groupSlug, featureSlug, testGroupId);
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
