import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './schemas/project.schema';
import { CreateProjectDto } from './dto/project.dto';
import { CreateTestGroupDto } from './dto/tests.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectService) { }

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createProject(createProjectDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Project> {
    return this.projectsService.findProjectById(id);
  }

  @Get('/slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<Project> {
    return this.projectsService.findProject(slug);
  }

  @Get(':projectSlug/groups/:groupSlug/features/:featureSlug')
  async getTestGroups(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
  ) {
    return this.projectsService.findTests(projectSlug, groupSlug, featureSlug);
  }

  @Post(':projectSlug/groups/:groupSlug/features/:featureSlug')
  async addTests(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
    @Body() createTestsDto: CreateTestGroupDto[],
  ) {
    return this.projectsService.addTests(
      projectSlug,
      groupSlug,
      featureSlug,
      createTestsDto,
    );
  }

  @Delete(':projectSlug/groups/:groupSlug/features/:featureSlug')
  async removeFeature(
    @Param('projectSlug') projectSlug: string,
    @Param('groupSlug') groupSlug: string,
    @Param('featureSlug') featureSlug: string,
  ) {
    return this.projectsService.removeFeature(
      projectSlug,
      groupSlug,
      featureSlug,
    );
  }
}
