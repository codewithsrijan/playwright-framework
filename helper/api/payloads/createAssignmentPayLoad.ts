// eslint-disable-next-line @typescript-eslint/no-var-requires
const { dateUtils } = require("../../../utils/dates");
import { v4 as uuidv4 } from "uuid";

export function createAssignmentRequest(
  audienceUuid: string,
  userUuid: string,
  organizationUuid: string,
  adminUuid: string,
  businessObjectiveUuid: string
) {
  return {
    organizationUuid: organizationUuid,
    action: "launch",
    audienceUuids: [audienceUuid],
    businessObjectiveUuid: businessObjectiveUuid,
    contents: [
      {
        contentId: "ca77460d-3088-4f16-b81f-424f6e0e2d90",
        contentType: "Video",
        enableCourseRetake: false,
        enableRecurrenceCourseRetake: false,
      },
    ],
    createdBy: adminUuid,
    customEmailMessage: "Test Email",
    daysToComplete: 5,
    description: "description-" + uuidv4(),
    emailScheduledAt: dateUtils.todayDateWithTimeStamp(),
    isContentOrderRequired: false,
    isEmailRequired: true,
    name: "assignmentName" + uuidv4(),
    startDate: dateUtils.todayDateWithTimeStamp(),
    timezone: "UTC",
    userUuids: [userUuid],
    scopeType: 1,
    assignmentCollaborators: [],
    isRetakeRequired: false,
    goal: "other",
    enableEquivalency: false,
    defaultLocale: "en-US",
  };
}

