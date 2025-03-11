export interface FormTemplateOption {
  Id: string
  Value: string
  SortOrder: number
}

export interface FormTemplateTrigger {
  GroupId: string
  QuestionValue: string
}

export interface FormTemplateAttachment {
  id: string
  url: string
  type: string
  name: string
}

export interface FormTemplateQuestion {
  Options: FormTemplateOption[] | null
  Triggers: FormTemplateTrigger[]
  Id: string
  SortOrder: number
  Type: string
  Name: string
  IsMandatory: boolean
  IsAutoFill: boolean
  Attachments: FormTemplateAttachment[]
  QuestionGroupId: string | null
  ForImageRecognition: boolean | null
  MatrixGroupId: string | null
}

export interface FormTemplateQuestionGroup {
  FreeFormItems: Record<string, unknown> | null
  Id: string
  Name: string
  Type: string
  TriggeredBy: {
    QuestionId: string
    QuestionValue: string
  }[]
}

export interface FormTemplate {
  Questions: FormTemplateQuestion[]
  Id: string
  Name: string
  Description: string
  Active: boolean
  SortOrder: number
  Version: number
  CreatedBy: string
  CreatedUtc: string
  LastUpdatedBy: string
  LastUpdatedUtc: string
  LastUpdatedLocal: string
  QuestionGroups: FormTemplateQuestionGroup[]
}

export interface FormTemplateRequest {
  clientId: string
  template: FormTemplate
  dashboardName: string
}
