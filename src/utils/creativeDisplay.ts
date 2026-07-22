export function creativeDisplayTitle(title: string) {
  const withoutOptionPrefix = title.replace(/^Option\s+\d+:\s*/i, '').trim();

  if (/^Revision:/i.test(withoutOptionPrefix)) {
    return 'Revision';
  }

  if (/^Variation:/i.test(withoutOptionPrefix)) {
    return 'Variation';
  }

  if (!withoutOptionPrefix) {
    return 'Creative';
  }

  const cleaned = withoutOptionPrefix
    .replace(/^(please|kindly|can you|could you|i need|i want|create|generate|make|use)\s+/i, '')
    .replace(/\s+(please|okay|ok)$/i, '')
    .trim();

  if (
    !cleaned ||
    /^(campaign creative|creative from json|json prompt generator session|untitled prompt|new visual concept)$/i.test(cleaned) ||
    /^creative from json(\s+v\d+)?$/i.test(cleaned) ||
    /^json\s+v\d+$/i.test(cleaned) ||
    cleaned.split(/\s+/).length > 8
  ) {
    return 'Campaign Creative';
  }

  return cleaned.length > 44 ? `${cleaned.slice(0, 41).trimEnd()}...` : cleaned;
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function compactName(value: unknown) {
  const raw = asString(value);

  if (!raw) {
    return undefined;
  }

  return creativeDisplayTitle(raw.replace(/\b(campaign|creative|prompt)\b/gi, '').trim());
}

export function promptGenerationDisplayTitle(generation: {
  generatedJson: Record<string, unknown>;
  promptMetadata: Record<string, unknown>;
  versionNumber: number;
}) {
  const metadataTitle = compactName(generation.promptMetadata.displayTitle);

  if (metadataTitle && metadataTitle !== 'Campaign Creative') {
    return metadataTitle;
  }

  const generatedJson = asRecord(generation.generatedJson);
  const jsonTitle = compactName(generatedJson.title);

  if (jsonTitle && jsonTitle !== 'Campaign Creative') {
    return jsonTitle;
  }

  const campaign = asRecord(generatedJson.campaign);
  const campaignType = compactName(campaign.type);
  const industry = compactName(campaign.industry);

  if (campaignType && campaignType !== 'Campaign Creative') {
    return campaignType;
  }

  if (industry && industry !== 'Campaign Creative') {
    return `${industry} Creative`;
  }

  return `JSON v${generation.versionNumber}`;
}
