// eslint-disable-next-line @typescript-eslint/no-var-requires
const { dateUtils } = require("../../../utils/dates");

type CreateChannelOptions = {
  audiences?: any[];
  newLocales?: string[];
  description?: string;
  imageUrl?: string;
  locale?: string;
  languageCode?: string;
  modifiedCounter?: number;
  subjectUuids?: string[];
  title?: string;
};

export function createChannelRequest(options: CreateChannelOptions = {}) {
  const fallbackTitle = "Channel-" + Date.now().toString(36);
  return {
    audiences: options.audiences || [],
    newLocales: options.newLocales || [],
    description: options.description || "Description-" + Date.now().toString(36),
    imageUrl:
      options.imageUrl ||
      "https://cdn2.percipio.com/public/c/channel/images/saved/6d9c0e90-b293-11e7-a9da-49acecd508d2/d0df8f80-b59b-11e7-a2af-a6b1aefb788a.jpg",
    locale: options.locale || "en-US",
    languageCode: options.languageCode || "en",
    modifiedCounter: options.modifiedCounter || 0,
    subjectUuids: options.subjectUuids || [],
    title: options.title || fallbackTitle,
  };
}

type LegacyOptions = {
  subjectUuids?: string[];
  imageUrl?: string;
  modifiedCounter?: number;
  saveFileRequest?: any;
  saveLogoFileRequest?: any;
  typeName?: string;
  displayTypeName?: string;
  initialConfig?: string;
  localizedMetadata?: Array<{ imageAltText: string; locale: string; description: string; title: string }>;
  newLocales?: string[];
  sourceName?: string;
  category?: string;
  enableJourneyBadging?: boolean;
  enableTrackBadging?: boolean;
  journeyStyle?: string;
  subtypeName?: string;
  requiredCompletionType?: string;
  removeEnglishFirst?: boolean;
  examNumber?: string;
  examFormat?: string;
  examLevel?: string;
  proofOfCertificationNeeded?: boolean;
  certificationLogoUrl?: string;
  certificationLogoDisplayName?: string;
  certificationLogoName?: string;
  completionCertificateEnabled?: boolean;
  skills?: any[];
  imageAltText?: string;
  title?: string;
  description?: string;
};

export function createChannelRequestLegacy(options: LegacyOptions = {}) {
  const fallbackTitle = options.title || "Channel-" + Date.now().toString(36);
  const fallbackDescription = options.description || "Description-" + Date.now().toString(36);

  return {
    subjectUuids: options.subjectUuids || [],
    imageUrl: options.imageUrl || "https://cdn2.percipio.com/public/c/public/images/customChannel.jpg",
    modifiedCounter: options.modifiedCounter || 0,
    saveFileRequest: options.saveFileRequest || null,
    saveLogoFileRequest: options.saveLogoFileRequest || null,
    typeName: options.typeName || "CUSTOM",
    displayTypeName: options.displayTypeName || "Custom Channel",
    initialConfig: options.initialConfig || "standard",
    localizedMetadata:
      options.localizedMetadata || [
        {
          imageAltText: options.imageAltText || "Channel Image",
          locale: "en-US",
          description: fallbackDescription,
          title: fallbackTitle,
        },
      ],
    newLocales: options.newLocales || [],
    sourceName: options.sourceName || "Custom",
    category: options.category || "General",
    enableJourneyBadging: options.enableJourneyBadging ?? false,
    enableTrackBadging: options.enableTrackBadging ?? false,
    journeyStyle: options.journeyStyle || "",
    subtypeName: options.subtypeName || "",
    requiredCompletionType: options.requiredCompletionType || "OPTIONAL",
    removeEnglishFirst: options.removeEnglishFirst ?? false,
    examNumber: options.examNumber || "",
    examFormat: options.examFormat || "",
    examLevel: options.examLevel || "",
    proofOfCertificationNeeded: options.proofOfCertificationNeeded ?? false,
    certificationLogoUrl: options.certificationLogoUrl || "",
    certificationLogoDisplayName: options.certificationLogoDisplayName || "",
    certificationLogoName: options.certificationLogoName || "",
    completionCertificateEnabled: options.completionCertificateEnabled ?? false,
    skills: options.skills || [],
  };
}

export function createJourneyRequest(journeyTitle: string, subjectUuids: string[] = [], journeyStyle = "CLASSIC") {
  const timestamp = dateUtils.todayDateWithTimeStamp();
  return {
    subjectUuids,
    imageUrl: "https://cdn2.percipio.com/public/c/public/images/learningJourney.jpg",
    modifiedCounter: 0,
    saveFileRequest: null,
    saveLogoFileRequest: null,
    typeName: "JOURNEY",
    displayTypeName: "Learning Journey",
    initialConfig: "journey",
    localizedMetadata: [
      {
        imageAltText: `${journeyTitle} Learning Journey`,
        locale: "en-US",
        description: `Comprehensive learning journey for ${journeyTitle} with guided progression through curated content`,
        title: journeyTitle || `Learning_Journey_${timestamp}`,
      },
    ],
    newLocales: [],
    sourceName: "Custom Journey",
    category: "Learning Path",
    enableJourneyBadging: true,
    enableTrackBadging: true,
    journeyStyle, // LINEAR, ADAPTIVE, FLEXIBLE
    subtypeName: "GUIDED_LEARNING",
    requiredCompletionType: "SEQUENTIAL",
    removeEnglishFirst: false,
    examNumber: "",
    examFormat: "",
    examLevel: "",
    proofOfCertificationNeeded: false,
    certificationLogoUrl: "",
    certificationLogoDisplayName: "",
    certificationLogoName: "",
    completionCertificateEnabled: true,
    skills: [],
  };
}

export function createCertificationPathJourneyRequest(
  certificationTitle: string,
  examNumber: string,
  examFormat = "ONLINE",
  examLevel = "INTERMEDIATE"
) {
  const timestamp = dateUtils.todayDateWithTimeStamp();
  return {
    subjectUuids: [],
    imageUrl: "https://cdn2.percipio.com/public/c/public/images/certification.jpg",
    modifiedCounter: 0,
    saveFileRequest: null,
    saveLogoFileRequest: null,
    typeName: "CERTIFICATION",
    displayTypeName: "Certification Program",
    initialConfig: "certification",
    localizedMetadata: [
      {
        imageAltText: `${certificationTitle} Certification`,
        locale: "en-US",
        description: `Professional certification program for ${certificationTitle} with exam preparation and validation`,
        title: certificationTitle || `Certification_Program_${timestamp}`,
      },
    ],
    newLocales: [],
    sourceName: "Certification Provider",
    category: "Professional Development",
    enableJourneyBadging: true,
    enableTrackBadging: true,
    journeyStyle: "CERTIFICATION",
    subtypeName: "EXAM_PREP",
    requiredCompletionType: "MANDATORY",
    removeEnglishFirst: false,
    examNumber,
    examFormat, // ONLINE, PAPER, PROCTORED
    examLevel, // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    proofOfCertificationNeeded: true,
    certificationLogoUrl: "https://cdn2.percipio.com/public/c/public/images/certLogo.png",
    certificationLogoDisplayName: `${certificationTitle} Certificate`,
    certificationLogoName: "certification_logo.png",
    completionCertificateEnabled: true,
    skills: [],
  };
}

export function createMultiLanguageChannelRequest(channelTitle: string, locales: string[] = ["en-US", "es-ES", "fr-FR"]) {
  const timestamp = dateUtils.todayDateWithTimeStamp();
  const localizedMetadata = locales.map((locale) => {
    const languageMap: Record<string, { title: string; description: string }> = {
      "en-US": { title: channelTitle, description: `English version of ${channelTitle}` },
      "es-ES": { title: `${channelTitle} (Español)`, description: `Versión en español de ${channelTitle}` },
      "fr-FR": { title: `${channelTitle} (Français)`, description: `Version française de ${channelTitle}` },
      "de-DE": { title: `${channelTitle} (Deutsch)`, description: `Deutsche Version von ${channelTitle}` },
      "it-IT": { title: `${channelTitle} (Italiano)`, description: `Versione italiana di ${channelTitle}` },
    };
    const localeData = languageMap[locale] || { title: channelTitle, description: `${locale} version of ${channelTitle}` };
    return {
      imageAltText: `${localeData.title} Image`,
      locale: locale,
      description: localeData.description,
      title: localeData.title,
    };
  });

  return {
    subjectUuids: [],
    imageUrl: "https://cdn2.percipio.com/public/c/public/images/multiLanguageChannel.jpg",
    modifiedCounter: 0,
    saveFileRequest: null,
    saveLogoFileRequest: null,
    typeName: "MULTILINGUAL",
    displayTypeName: "Multi-Language Channel",
    initialConfig: "multilingual",
    localizedMetadata,
    newLocales: locales.filter((locale) => locale !== "en-US"),
    sourceName: "Global Content",
    category: "International",
    enableJourneyBadging: false,
    enableTrackBadging: false,
    journeyStyle: "",
    subtypeName: "INTERNATIONAL",
    requiredCompletionType: "OPTIONAL",
    removeEnglishFirst: true,
    examNumber: "",
    examFormat: "",
    examLevel: "",
    proofOfCertificationNeeded: false,
    certificationLogoUrl: "",
    certificationLogoDisplayName: "",
    certificationLogoName: "",
    completionCertificateEnabled: false,
    skills: [],
  };
}

