import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectService } from './project.service';
import { ProjectsController } from './project.controller';
import {
  Feature,
  FeaturesSchema,
  Project,
  ProjectSchema,
} from './schemas/project.schema';
import { TestGroup, TestGroupSchema } from './schemas/tests.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: Feature.name, schema: FeaturesSchema }]),
    MongooseModule.forFeature([
      { name: TestGroup.name, schema: TestGroupSchema },
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectService],
})
export class ProjectModule {}
