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
