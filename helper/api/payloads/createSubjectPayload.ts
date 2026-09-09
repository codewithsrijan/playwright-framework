import { v4 as uuidv4 } from "uuid";

export function createSubjectRequest(
  areaUuid?: string,
  channelUuids: string[] = [],
  uploadUuid?: string,
  ownerUuid?: string
) {
  const title = "Subject-" + uuidv4();
  const description = "Description-" + uuidv4();

  return {
    title,
    localizedMetadataList: [
      {
        title,
        description,
        languageId: 1,
        imageAltText: "Custom Subject",
      },
    ],
    areaUuid: areaUuid || uuidv4(),
    imageUrl: "https://cdn2.percipio.com/public/c/public/images/customSubject.jpg",
    subjectType: "standard",
    includedInInterests: true,
    saveFileRequest: uploadUuid
      ? {
          uploadUuid,
          fileName: `subject_image_${Date.now()}.jpg`,
          ownerUuid: ownerUuid || uuidv4(),
        }
      : null,
    channelUuids: channelUuids.length > 0 ? channelUuids : [],
  };
}

export function createSubjectRequestWithDetails(
  titleValue: string,
  areaUuid: string,
  channelUuids: string[] = [],
  description?: string | null
) {
  const subjectDescription = description || `Description for ${titleValue}`;

  return {
    title: titleValue,
    localizedMetadataList: [
      {
        title: titleValue,
        description: subjectDescription,
        languageId: 1,
        imageAltText: `${titleValue} Subject`,
      },
    ],
    areaUuid,
    imageUrl: "https://cdn2.percipio.com/public/c/public/images/customSubject.jpg",
    subjectType: "standard",
    includedInInterests: true,
    saveFileRequest: null,
    channelUuids,
  };
}

