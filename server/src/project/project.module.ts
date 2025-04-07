import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/project.schema';
import { Group, GroupSchema } from './schemas/group.schema';
import { Feature, FeaturesSchema } from './schemas/feature.schema';
import { TestGroup, TestGroupSchema } from './schemas/tests.schema';
import { ProjectsController } from './project.controller';
import { ProjectService } from './services/project.service';
import { GroupService } from './services/group.service';
import { FeatureService } from './services/feature.service';
import { ProjectHelpers } from './helpers/project.helpers';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    MongooseModule.forFeature([{ name: Feature.name, schema: FeaturesSchema }]),
    MongooseModule.forFeature([
      { name: TestGroup.name, schema: TestGroupSchema },
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectService, GroupService, FeatureService, ProjectHelpers],
  exports: [ProjectService, GroupService, FeatureService],
})
export class ProjectModule { }
