import { v4 as uuidv4 } from "uuid";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { dateUtils } = require("../../../utils/dates");

type LinkedContentOptions = {
  title?: string;
  description?: string;
  url?: string;
  providerName?: string;
  providerAssetId?: string | null;
  durationInSeconds?: number;
  modality?: string;
  category?: string;
  expertiseLevel?: string;
  trackingMethod?: string;
  sourceName?: string;
  vendor?: string;
  linkedContentType?: string;
  imageUrl?: string;
  ownerUuid?: string;
  createdBy?: string;
  modifiedBy?: string;
  linkedContentUuid?: string;
  badgeCustomTitle?: string;
  locale?: string;
  languageCode?: string;
  timeZone?: string;
};

export function createLinkedContentRequest(options: LinkedContentOptions = {}) {
  const {
    title = "Default Linked Content",
    description = '<p class="EditorTheme__paragraph"><span>Default description</span></p>',
    url = "https://www.google.com",
    providerName = "STANDARD",
    providerAssetId = null,
    durationInSeconds = 3600,
    modality = "READ",
    category = "Link",
    expertiseLevel = "Everyone",
    trackingMethod = "SELF_REPORTED",
    sourceName = "www.google.com",
    vendor = "NONE",
    linkedContentType = "EXTERNAL_LINK",
    imageUrl = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    ownerUuid,
    createdBy = "Automation Test User",
    modifiedBy = "Automation Test User",
    linkedContentUuid,
    badgeCustomTitle,
    locale = "en-US",
    languageCode = "en",
    timeZone = "UTC",
  } = options;

  const currentDate = new Date().toISOString();

  return {
    linkedContentType,
    title,
    locale,
    url,
    modality,
    trackingMethod,
    description,
    imageUrl,
    closedCaptionsFilePath: null,
    durationInSeconds,
    category,
    expertiseLevel,
    modifiedCounter: 0,
    sourceName,
    providerAttributes: null,
    providerName,
    curationPermission: "CUSTOM",
    vendor,
    providerAssetId,
    minResolution: 1024,
    launchSource: "URL",
    shared: false,
    timeZone,
    owned: true,
    technologyVersion: null,
    startTime: null,
    endTime: null,
    enableCustomCourseBadging: false,
    imageAltText: "Custom content",
    badgeCustomTitle: badgeCustomTitle || (title as string),
    skills: [],
    syncCompletionData: true,
    audience: {},
    linkedContentUuid,
    languageCode,
    technologyTitle: null,
    lastPublishDate: null,
    createdBy,
    modifiedBy,
    createdDate: currentDate,
    lastModifiedDate: currentDate,
    plannedRetirementDate: null,
    ownerUuid,
    latestPackageVersion: null,
    latestRusticiVersion: null,
    badges: [],
    skillsData: [],
    saveFileRequest: null,
  };
}

export function createYouTubeLinkedContentRequest(options: { title?: string; videoId?: string; durationInSeconds?: number } = {}) {
  const { title = "YouTube Video Content", videoId = "dQw4w9WgXcQ", durationInSeconds = 212, ...otherOptions } = options as any;

  return createLinkedContentRequest({
    title,
    description: `<p class="EditorTheme__paragraph"><span>YouTube video: ${title}</span></p>`,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    sourceName: "www.youtube.com",
    providerName: "YOUTUBE",
    providerAssetId: videoId,
    durationInSeconds,
    category: "Video",
    modality: "WATCH",
    trackingMethod: "PROVIDER",
    imageUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    ...(otherOptions as any),
  });
}

export function createLinkedContentWithUploadRequest(
  contentTitle: string,
  uploadUuid: string,
  fileName: string,
  ownerUuid: string,
  contentType: "Document" | "Video" = "Document"
) {
  const timestamp = dateUtils.todayDateWithTimeStamp();

  return {
    title: contentTitle || `Uploaded_Content_${timestamp}`,
    locale: "en-US",
    languageCode: "en",
    url: "",
    modality: contentType === "Video" ? "WATCH" : "READ",
    description: `Uploaded ${contentType.toLowerCase()} content: ${contentTitle || "Educational Material"}`,
    imageUrl: "https://cdn2.percipio.com/public/c/public/images/uploadedContent.jpg",
    durationInSeconds: contentType === "Video" ? 900 : 180,
    category: contentType,
    expertiseLevel: "Everyone",
    modifiedCounter: 0,
    technologyTitle: "",
    technologyVersion: "",
    trackingMethod: "SCORM",
    sourceName: "Uploaded Content",
    saveFileRequest: {
      uploadUuid,
      fileName,
      ownerUuid,
    },
    providerName: "Internal",
    curationPermission: "CUSTOM",
    providerAttributes: "",
    vendor: "Internal",
    providerAssetId: uploadUuid,
    linkedContentType: "UPLOAD",
    minResolution: 320,
    fileName,
    generateUniqueTitle: false,
    uploadUuid,
    launchSource: "",
    launchTarget: "",
    multiUnit: true,
    errorDetail: [],
    packageVersion: 1,
    packageAction: "CREATE",
    jobStatus: "PENDING",
    externalId: "",
    additionalSearchTerms: ["uploaded", contentType.toLowerCase(), "internal"],
    enableCustomCourseBadging: true,
    imageAltText: `${contentTitle || "Uploaded Content"} Image`,
    badgeCustomTitle: contentTitle || "Custom Badge",
    closedCaptionsFilePath: "",
    skills: [],
    syncCompletionData: true,
  };
}

export function createSCORMLinkedContentRequest(
  packageTitle: string,
  uploadUuid: string,
  packageFileName: string,
  ownerUuid: string
) {
  const timestamp = dateUtils.todayDateWithTimeStamp();

  return {
    title: packageTitle || `SCORM_Package_${timestamp}`,
    locale: "en-US",
    languageCode: "en",
    url: "",
    modality: "PRACTICE",
    description: `SCORM package content: ${packageTitle || "Interactive Learning Module"}`,
    imageUrl: "https://cdn2.percipio.com/public/c/public/images/scormContent.jpg",
    durationInSeconds: 1800,
    category: "Course",
    expertiseLevel: "Intermediate",
    modifiedCounter: 0,
    technologyTitle: "",
    technologyVersion: "",
    trackingMethod: "SCORM",
    sourceName: "SCORM Package",
    saveFileRequest: {
      uploadUuid,
      fileName: packageFileName,
      ownerUuid,
    },
    providerName: "SCORM",
    curationPermission: "CUSTOM",
    providerAttributes: '{"scormVersion":"1.2","completionCriteria":"passed"}',
    vendor: "Internal",
    providerAssetId: uploadUuid,
    linkedContentType: "SCORM",
    minResolution: 1024,
    fileName: packageFileName,
    generateUniqueTitle: false,
    uploadUuid,
    launchSource: "IFRAME",
    launchTarget: "_self",
    multiUnit: true,
    errorDetail: [],
    packageVersion: 1,
    packageAction: "EXTRACT",
    jobStatus: "PROCESSING",
    externalId: "",
    additionalSearchTerms: ["scorm", "interactive", "course", "elearning"],
    enableCustomCourseBadging: true,
    imageAltText: `${packageTitle || "SCORM Package"} Image`,
    badgeCustomTitle: packageTitle || "Course Completion",
    closedCaptionsFilePath: "",
    skills: [],
    syncCompletionData: true,
  };
}

