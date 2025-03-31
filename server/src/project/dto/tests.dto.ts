export class CreateTestDto {
  readonly name: string;
  readonly description?: string;
  readonly link?: string;
  readonly status: string;
}

export class CreateTestGroupDto {
  readonly name: string;
  readonly tests: CreateTestDto[];
}


export class CreateReportDto {
  readonly featureSlug: string;
  readonly groupSlug: string;
  readonly report: CreateTestGroupDto[];
}