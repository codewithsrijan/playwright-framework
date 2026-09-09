type ContentItem = {
  contentUuid: string;
  contentType?: string;
};

export function createAddContentToChannelPayload(options: { linkedContentUuid: string }) {
  const { linkedContentUuid } = options;
  return {
    contentItems: [
      {
        contentItemUuid: linkedContentUuid,
        contentItemType: "LINKED_CONTENT",
      },
    ],
  };
}

export function createAddMultipleContentToChannelPayload(contentItems: ContentItem[] = []) {
  return {
    contentItems: contentItems.map((item) => ({
      contentItemUuid: item.contentUuid,
      contentItemType: item.contentType || "LINKED_CONTENT",
    })),
  };
}

