// eslint-disable-next-line @typescript-eslint/no-var-requires
const { dateUtils } = require("../../../utils/dates");
import { v4 as uuidv4 } from "uuid";

export function createLearningProgramRequest(
  audienceUuid: string,
  userUuid: string,
  organizationUuid: string,
  adminUuid: string
) {
  const title = "title-" + uuidv4();
  const description = "description-" + uuidv4();
  return {
    organizationUuid: organizationUuid,
    title,
    action: "launch",
    description,
    createdBy: adminUuid,
    adminContact: "",
    goal: "",
    businessObjectiveUuid: "0d9eec1b-2d36-4959-954e-523ec1d31b37",
    startDate: dateUtils.todayDateWithTimeStamp(),
    contents: [
      {
        contentId: "25022262-e4b1-11e6-a792-0242c0a80b09",
        contentType: "Course",
        enableCourseRetake: false,
        providerName: "",
      },
    ],
    cohorts: [
      {
        cohortUuid: uuidv4(),
        name: "cohort-" + title,
        createdBy: adminUuid,
        startDate: dateUtils.todayDateWithTimeStamp(),
        daysToComplete: 5,
        userUuids: [userUuid],
        audienceUuids: [audienceUuid],
        enrollmentType: "assign",
        enrolledBy: adminUuid,
        completionSurvey: false,
        teamsChannel: "",
        msteamsRedirectUrl: "",
        slackChannel: "",
        slackRedirectUrl: "",
        campaignFrequency: 0,
        sendWelcomeEmail: true,
        sendWelcomeEmailAt: dateUtils.todayDateWithTimeStamp(),
        sendInviteEmail: true,
        sendInvitationEmailAt: dateUtils.todayDateWithTimeStamp(),
        customEmailMessageInvitation: "",
        isDefaultEmailMessageInvitation: true,
        customEmailMessageWelcome: "",
        isDefaultEmailMessageWelcome: true,
        customEmailMessageCampaign: "",
        isDefaultEmailMessageCampaign: true,
        customMessageChannelWelcome: "",
        isDefaultMessageChannelWelcome: true,
        customMessageChannelCampaign: "",
        isDefaultMessageChannelCampaign: true,
        countOfEnrolledUsers: 0,
        isDefaultEmailMessagecompletion: true,
        customEmailMessageCompletion: "",
        sendReminderEmail: true,
        sendReminderMessage: true,
        sendProgramCompletionEmail: true,
        sendWelcomeMessage: true,
      },
    ],
    enableCompletionCertificate: true,
    isContentOrderRequired: true,
    enableFeedbackSurvey: true,
    includeStandardSkillsoftSurvey: true,
    customCompletionSurveyLink: "",
    typeName: "",
    enableLeaderboard: true,
    category: "other",
    enableEquivalency: true,
    localizedMetadata: [
      { locale: "en-US", name: "english", description: "english" },
      { locale: "fr-FR", name: "french", description: "french" },
    ],
  };
}

