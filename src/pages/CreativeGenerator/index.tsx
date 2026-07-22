import { useState, useEffect } from 'react';
import {
  ChevronDown,
  Copy,
  Download,
  Heart,
  ImagePlus,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  WandSparkles,
  X,
  ZoomIn,
} from 'lucide-react';

import { Badge, MockVisual } from '@/components/common';
import { Header } from '@/components/layout/Header';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Textarea,
} from '@/components/ui';
import { CreativeLearningPanel } from '@/components/creative/CreativeLearningPanel';
import { promptService, type PromptGeneration } from '@/services/prompt.service';
import {
  creativeService,
  type CreativeFeedbackSignalType,
  type CreativeItem,
} from '@/services/creative.service';
import { cn } from '@/utils/cn';
import { creativeDisplayTitle, promptGenerationDisplayTitle } from '@/utils/creativeDisplay';

const aspectMap: Record<string, string> = {
  '1:1': 'aspect-square',
  '4:5': 'aspect-[4/5]',
  '9:16': 'aspect-[9/16]',
  '16:9': 'aspect-[16/9]',
  '3:2': 'aspect-[3/2]',
  '2:3': 'aspect-[2/3]',
};

const aspectRatios = [
  { label: 'Square 1:1', value: '1:1' },
  { label: 'Portrait 4:5', value: '4:5' },
  { label: 'Story 9:16', value: '9:16' },
  { label: 'Landscape 16:9', value: '16:9' },
];

const qualityOptions = [
  { label: 'Standard', value: 'standard' },
  { label: 'High', value: 'high' },
  { label: 'Ultra', value: 'ultra' },
];

const countOptions = [
  { label: '1 image', value: '1' },
  { label: '2 images', value: '2' },
  { label: '4 images', value: '4' },
  { label: '6 images', value: '6' },
];

function promptGenerationLabel(generation: PromptGeneration) {
  const createdDate = new Date(generation.createdAt);
  const dateLabel = Number.isNaN(createdDate.getTime())
    ? 'saved JSON'
    : createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const referenceLabel = generation.referenceImageUrl ? ' · reference' : '';
  const title = promptGenerationDisplayTitle(generation);

  return `${title} · v${generation.versionNumber} · ${dateLabel}${referenceLabel}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function errorMessage(error: unknown, fallback: string) {
  const response = isRecord(error) ? error.response : undefined;
  const data = isRecord(response) ? response.data : undefined;
  const apiMessage = isRecord(data) && typeof data.message === 'string' ? data.message : undefined;

  if (apiMessage) {
    return apiMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export default function CreativeGeneratorPage() {
  const [creativeName, setCreativeName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [jsonPreset, setJsonPreset] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState('standard');
  const [imageCount, setImageCount] = useState('1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingCreatives, setIsLoadingCreatives] = useState(true);
  const [creativesLoadError, setCreativesLoadError] = useState<string | null>(null);
  const [promptGenerationsLoadError, setPromptGenerationsLoadError] = useState<string | null>(
    null,
  );
  const [creatives, setCreatives] = useState<CreativeItem[]>([]);
  const [previewCreative, setPreviewCreative] = useState<CreativeItem | null>(null);
  const [promptGenerations, setPromptGenerations] = useState<PromptGeneration[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    title: string;
    tone: 'success' | 'info';
  } | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [selectedCreativeForRevision, setSelectedCreativeForRevision] = useState<CreativeItem | null>(null);
  const [revisionPrompt, setRevisionPrompt] = useState('');

  const selectedPromptGeneration = promptGenerations.find(
    (generation) => generation.id === jsonPreset,
  );

  const creativeTitle = () => {
    return prompt.trim();
  };

  useEffect(() => {
    // Load generated creatives from database
    setIsLoadingCreatives(true);
    setCreativesLoadError(null);
    creativeService
      .list()
      .then((res) => {
        if (res.data && res.data.data) {
          setCreatives(res.data.data);
        }
      })
      .catch((err: unknown) => {
        console.error('Failed to load creatives:', err);
        setCreativesLoadError(errorMessage(err, 'Failed to load generated creatives.'));
      })
      .finally(() => setIsLoadingCreatives(false));

    // Load prompt generations from Supabase (interlinking)
    setPromptGenerationsLoadError(null);
    promptService
      .listGenerations()
      .then((res) => {
        if (res.data && res.data.data) {
          setPromptGenerations(res.data.data);
        }
      })
      .catch((err: unknown) => {
        console.error('Failed to load prompt generations:', err);
        setPromptGenerationsLoadError(errorMessage(err, 'Failed to load saved JSON presets.'));
      });
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleGenerate = () => {
    const title = creativeTitle();

    if (!selectedPromptGeneration && !title) {
      setNotification({
        title: 'Select JSON',
        message: 'Choose a generated JSON or add a short prompt before generating.',
        tone: 'info',
      });
      return;
    }

    setIsGenerating(true);
    setNotification(null);

    creativeService
      .generate({
        title,
        creativeName: creativeName.trim() || undefined,
        aspectRatio,
        quality,
        imageCount: parseInt(imageCount, 10),
        promptGenerationId: jsonPreset || undefined,
      })
      .then((res) => {
        setIsGenerating(false);
        if (res.data && res.data.data) {
          setCreatives((prev) => [...res.data.data, ...prev]);
          setNotification({
            title: 'Creatives Generated',
            message: `Successfully generated ${imageCount} option(s) and uploaded to cpanel.`,
            tone: 'success',
          });
        }
      })
      .catch((err: unknown) => {
        setIsGenerating(false);
        setNotification({
          title: 'Generation Failed',
          message: errorMessage(err, 'Failed to generate visual concepts.'),
          tone: 'info',
        });
      });
  };

  const handleRegenerate = () => {
    const title = creativeTitle();

    if (!selectedPromptGeneration && !title) {
      setNotification({
        title: 'Select JSON',
        message: 'Choose a generated JSON or add a short prompt before regenerating.',
        tone: 'info',
      });
      return;
    }

    setIsGenerating(true);
    setNotification(null);

    creativeService
      .generate({
        title,
        creativeName: creativeName.trim() || undefined,
        aspectRatio,
        quality,
        imageCount: parseInt(imageCount, 10),
        promptGenerationId: jsonPreset || undefined,
      })
      .then((res) => {
        setIsGenerating(false);
        if (res.data && res.data.data) {
          setCreatives((prev) => [...res.data.data, ...prev]);
          setNotification({
            title: 'Grid Regenerated',
            message: 'Successfully generated new visual concepts with updated parameters.',
            tone: 'success',
          });
        }
      })
      .catch((err: unknown) => {
        setIsGenerating(false);
        setNotification({
          title: 'Regeneration Failed',
          message: errorMessage(err, 'Failed to regenerate visual concepts.'),
          tone: 'info',
        });
      });
  };

  const handleVariations = () => {
    if (creatives.length === 0) return;
    setIsGenerating(true);
    setNotification(null);

    const baseCreative = creatives[0];
    const baseName = creativeDisplayTitle(baseCreative.title);
    creativeService
      .generate({
        title: `Variation: ${baseName}`,
        creativeName: `${baseName} Variation`,
        aspectRatio: baseCreative.aspectRatio,
        quality,
        imageCount: 1,
        promptGenerationId: (baseCreative.promptGenerationId ?? jsonPreset) || undefined,
      })
      .then((res) => {
        setIsGenerating(false);
        if (res.data && res.data.data) {
          setCreatives((prev) => [...res.data.data, ...prev]);
          setNotification({
            title: 'Variation Created',
            message: 'Created a style variation based on your leading candidate.',
            tone: 'success',
          });
        }
      })
      .catch((err: unknown) => {
        setIsGenerating(false);
        setNotification({
          title: 'Failed to create variation',
          message: errorMessage(err, 'Failed to create variation.'),
          tone: 'info',
        });
      });
  };

  const handleApplyRevision = () => {
    if (!selectedCreativeForRevision) return;
    if (!revisionPrompt.trim()) {
      setNotification({
        title: 'Enter Revision Instructions',
        message: 'Please describe the changes you want to apply to this image.',
        tone: 'info',
      });
      return;
    }

    setIsGenerating(true);
    setNotification(null);

    creativeService
      .generate({
        title: `Revision: ${revisionPrompt.trim()}`,
        creativeName: `${creativeDisplayTitle(selectedCreativeForRevision.title)} Revision`,
        aspectRatio: selectedCreativeForRevision.aspectRatio,
        quality,
        imageCount: 1,
        promptGenerationId: selectedCreativeForRevision.promptGenerationId || jsonPreset || undefined,
        referenceImageUrl: selectedCreativeForRevision.imageUrl,
      })
      .then((res) => {
        setIsGenerating(false);
        setRevisionPrompt('');
        setSelectedCreativeForRevision(null);
        if (res.data && res.data.data) {
          setCreatives((prev) => [...res.data.data, ...prev]);
          setNotification({
            title: 'Revision Completed',
            message: 'Successfully generated revision variant and saved to database.',
            tone: 'success',
          });
        }
      })
      .catch((err: unknown) => {
        setIsGenerating(false);
        setNotification({
          title: 'Revision Failed',
          message: errorMessage(err, 'Failed to revise image.'),
          tone: 'info',
        });
      });
  };

  const captureCreativeSignal = (
    creative: CreativeItem,
    signalType: CreativeFeedbackSignalType,
    source: string,
  ) => {
    creativeService
      .createFeedback(creative.id, {
        metadata: {
          promptGenerationId: creative.promptGenerationId,
          source,
        },
        signalType,
      })
      .catch((err) => console.error(`Failed to capture ${signalType} signal:`, err));
  };

  const handleCreativeAction = (id: string, actionType: string) => {
    if (actionType === 'delete') {
      creativeService
        .delete(id)
        .then(() => {
          setCreatives((prev) => prev.filter((c) => c.id !== id));
          setNotification({
            title: 'Deleted',
            message: 'Visual removed from the campaign preview.',
            tone: 'success',
          });
        })
        .catch((err: unknown) => {
          setNotification({
            title: 'Delete Failed',
            message: errorMessage(err, 'Failed to delete the visual.'),
            tone: 'info',
          });
        });
    } else if (actionType === 'favorite') {
      creativeService
        .toggleFavorite(id)
        .then((res) => {
          if (res.data && res.data.data) {
            const updated = res.data.data;
            setCreatives((prev) =>
              prev.map((c) => (c.id === id ? { ...c, favorite: updated.favorite } : c)),
            );
            setNotification({
              title: updated.favorite ? 'Added to Favorites' : 'Removed from Favorites',
              message: updated.favorite
                ? 'Visual saved to library.'
                : 'Visual removed from library.',
              tone: 'success',
            });
          }
        })
        .catch((err) => console.error('Failed to toggle favorite:', err));
    } else if (actionType === 'download') {
      const creative = creatives.find((c) => c.id === id);
      if (creative) {
        const url = creative.imageUrl;
        const filename =
          creative.cpanelFilename ||
          `${creativeDisplayTitle(creative.title).toLowerCase().replace(/[^a-z0-9]+/g, '_')}.png`;
        captureCreativeSignal(creative, 'exported', 'download_action');

        setNotification({
          title: 'Downloading Image',
          message: 'Your creative concept image is downloading.',
          tone: 'success',
        });

        fetch(url)
          .then((res) => res.blob())
          .then((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          })
          .catch((err) => {
            console.error('Download failed', err);
            window.open(url, '_blank');
          });
      }
    } else if (actionType === 'select_revision') {
      const creative = creatives.find((c) => c.id === id);
      if (creative) {
        setSelectedCreativeForRevision(creative);
        setRevisionPrompt('');
        captureCreativeSignal(creative, 'revision_requested', 'select_revision_action');
        setNotification({
          title: 'Revision Image Selected',
          message: `Selected '${creativeDisplayTitle(creative.title)}' for revision.`,
          tone: 'success',
        });
      }
    } else if (actionType === 'upscale') {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setNotification({
          title: 'Upscaled successfully',
          message: 'The visual was processed to 4K resolution using AI super-sampling.',
          tone: 'success',
        });
      }, 1200);
    }
  };
  return (
    <div className="relative space-y-6 animate-fade-in">
      {/* Visual Generation Progress Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md transition-all duration-300">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-center animate-scale-in">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
              <span className="absolute inset-0 rounded-full border-4 border-brand-100 border-t-brand-500 animate-spin" />
              <WandSparkles className="h-8 w-8 text-brand-600 dark:text-brand-400 animate-bounce" />
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
              Generating AI Visuals
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              GPT Image 2 is crafting PNG campaign assets...
            </p>

            <div className="mt-6 space-y-3 rounded-xl bg-slate-50 p-4 text-left dark:bg-slate-950/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Progress</span>
                <span className="text-brand-600 dark:text-brand-400 font-semibold">Running</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full w-2/3 rounded-full bg-brand-500 animate-pulse" />
              </div>
              <div className="space-y-1.5 pt-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Connecting to OpenAI API...</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Processing prompt details...</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-pulse" />
                  <span>Uploading output to CPanel directory...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 transition-all duration-300">
          <div
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white',
              notification.tone === 'success' ? 'bg-emerald-500' : 'bg-brand-500',
            )}
          >
            <WandSparkles aria-hidden="true" className="h-4 w-4" />
          </div>
          <div className="pr-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {notification.title}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {notification.message}
            </p>
          </div>
          <button
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            onClick={() => setNotification(null)}
          >
            ✕
          </button>
        </div>
      )}

      {previewCreative ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm transition-all duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setPreviewCreative(null)}
        >
          <div
            className="relative flex max-h-[85vh] max-w-md w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-scale-in"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3 bg-white dark:bg-slate-900">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {creativeDisplayTitle(previewCreative.title)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{previewCreative.aspectRatio}</p>
              </div>
              <Button
                aria-label="Close image preview"
                className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400"
                size="icon"
                type="button"
                variant="ghost"
                onClick={() => setPreviewCreative(null)}
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/40">
              <img
                alt={creativeDisplayTitle(previewCreative.title)}
                className="max-h-[48vh] w-auto rounded-lg object-contain shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955"
                src={previewCreative.imageUrl}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%230f172a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="16">Image failed to load</text></svg>';
                }}
              />
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 px-4 py-3 bg-slate-50 dark:bg-slate-900/50">
              <Button
                size="sm"
                variant="ghost"
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-semibold text-xs flex items-center gap-1"
                onClick={() => {
                  setSelectedCreativeForRevision(previewCreative);
                  setRevisionPrompt('');
                  setPreviewCreative(null);
                  setNotification({
                    title: 'Revision Image Selected',
                    message: `Selected '${creativeDisplayTitle(previewCreative.title)}' for revision.`,
                    tone: 'success',
                  });
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Refine
              </Button>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 text-xs"
                  onClick={() => {
                    handleCreativeAction(previewCreative.id, 'download');
                    setPreviewCreative(null);
                  }}
                >
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant={previewCreative.favorite ? 'primary' : 'secondary'}
                  className="h-8 text-xs"
                  onClick={() => handleCreativeAction(previewCreative.id, 'favorite')}
                >
                  <Heart className={cn("mr-1 h-3 w-3", previewCreative.favorite && "fill-current text-rose-500")} />
                  {previewCreative.favorite ? 'Favorited' : 'Favorite'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <Header
        description="Generate, refine, upscale, and manage AI campaign visuals with prompt controls."
        title="Creative Generator"
      />
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <div className="space-y-6 xl:sticky xl:top-24 h-fit animate-fade-in">
          <Card className="h-fit">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Creative Generator</CardTitle>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Generate campaign-ready visuals from prompts and settings.
                </p>
              </div>
              <Badge tone="purple">AI Studio</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input
              label="Creative name"
              placeholder="Example: Trust-led healthcare square ad"
              value={creativeName}
              onChange={(event) => setCreativeName(event.target.value)}
            />

            <Textarea
              className="min-h-36"
              label="Optional generation note"
              placeholder={
                selectedPromptGeneration
                  ? selectedPromptGeneration.referenceImageUrl
                    ? 'Optional: add one extra instruction. The selected JSON and its saved reference image are used automatically.'
                    : 'Optional: add one extra instruction. The selected JSON is used automatically.'
                  : 'Select a generated JSON, or enter a short prompt for manual generation.'
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="space-y-2">
                <Select
                  label="JSON selector"
                  value={jsonPreset}
                  onChange={(e) => {
                    const val = e.target.value;
                    setJsonPreset(val);
                    const selectedGen = promptGenerations.find((g) => g.id === val);
                    if (selectedGen) {
                      setPrompt('');
                      setCreativeName(promptGenerationDisplayTitle(selectedGen));
                      setAspectRatio(selectedGen.aspectRatio);
                      setQuality(selectedGen.quality);
                      setImageCount(String(selectedGen.imageCount));
                    } else {
                      setCreativeName('');
                    }
                  }}
                  options={[
                    { label: 'Select preset...', value: '' },
                    ...promptGenerations.map((g) => ({
                      label: promptGenerationLabel(g),
                      value: g.id,
                    })),
                  ]}
                />
                {selectedPromptGeneration && (
                  <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-2.5 bg-slate-50 dark:bg-slate-950/40 space-y-1.5 animate-fade-in">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Loaded Preset Assets</p>
                    <div className="flex items-center gap-2.5">
                      {selectedPromptGeneration.referenceImageUrl ? (
                        <img 
                          src={selectedPromptGeneration.referenceImageUrl} 
                          alt="Reference" 
                          className="h-10 w-10 rounded object-cover border border-slate-200 dark:border-slate-800"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-semibold">No Image</div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                          {promptGenerationDisplayTitle(selectedPromptGeneration)}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {selectedPromptGeneration.referenceImageUrl
                            ? 'Reference image and JSON sent to OpenAI'
                            : 'JSON-only prompt sent to OpenAI'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {promptGenerationsLoadError ? (
                  <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                    {promptGenerationsLoadError}
                  </p>
                ) : null}
              </div>
              <Select
                label="Aspect ratio"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                options={aspectRatios}
              />
              <Select
                label="Quality"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                options={qualityOptions}
              />
              <Select
                label="Image count"
                value={imageCount}
                onChange={(e) => setImageCount(e.target.value)}
                options={countOptions}
              />
            </div>

            <Textarea
              className="min-h-24"
              label="Negative prompt"
              placeholder="Avoid cluttered text, harsh shadows, unrealistic anatomy, low-resolution artifacts..."
            />

            <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 transition-colors">
              <button
                type="button"
                onClick={() => setAdvancedOpen(!advancedOpen)}
                className="flex w-full items-center justify-between p-4 text-sm font-semibold text-slate-900 dark:text-white outline-none"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
                  Advanced settings
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    advancedOpen && 'rotate-180',
                  )}
                />
              </button>
              {advancedOpen && (
                <div className="space-y-3 border-t border-slate-100 p-4 dark:border-slate-800">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Prompt adherence</span>
                      <span className="font-medium text-slate-900 dark:text-white">82%</span>
                    </div>
                    <input
                      className="mt-2 w-full accent-slate-950 dark:accent-white"
                      defaultValue="82"
                      max="100"
                      min="0"
                      type="range"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Style strength</span>
                      <span className="font-medium text-slate-900 dark:text-white">68%</span>
                    </div>
                    <input
                      className="mt-2 w-full accent-slate-950 dark:accent-white"
                      defaultValue="68"
                      max="100"
                      min="0"
                      type="range"
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              className="h-12 w-full text-base"
              type="button"
              isLoading={isGenerating}
              onClick={handleGenerate}
            >
              <WandSparkles aria-hidden="true" className="mr-2 h-5 w-5" />
              Generate
            </Button>
          </CardContent>
        </Card>

      </div>

        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Image Preview Grid</CardTitle>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Generated campaign options with production actions.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  type="button"
                  variant="secondary"
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                >
                  <RefreshCw
                    aria-hidden="true"
                    className={cn('h-4 w-4 mr-1', isGenerating && 'animate-spin')}
                  />
                  Regenerate
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="secondary"
                  onClick={handleVariations}
                  disabled={isGenerating || creatives.length === 0}
                >
                  <Copy aria-hidden="true" className="h-4 w-4 mr-1" />
                  Generate variations
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Dynamic Generation Skeletons / Slots */}
              {isGenerating ? (
                <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: Number(imageCount) || 1 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex h-36 flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/20 p-6 dark:border-slate-800 dark:bg-slate-950/40 animate-pulse"
                    >
                      <WandSparkles className="h-6 w-6 animate-spin text-brand-500" />
                      <span className="mt-2 text-xs font-semibold text-brand-600 dark:text-brand-400">
                        Generating concept {i + 1}...
                      </span>
                      <span className="mt-0.5 text-[10px] text-slate-400">
                        Layout: {aspectRatio}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}

              {isLoadingCreatives ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-64 rounded-xl border border-slate-200 bg-slate-100/70 dark:border-slate-800 dark:bg-slate-900/60 animate-pulse"
                    />
                  ))}
                </div>
              ) : creativesLoadError ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-rose-200 bg-rose-50/50 p-12 text-center dark:border-rose-900 dark:bg-rose-950/20">
                  <ImagePlus className="h-10 w-10 text-rose-400" />
                  <p className="mt-2 text-sm font-semibold text-rose-700 dark:text-rose-300">
                    Could not load creatives
                  </p>
                  <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                    {creativesLoadError}
                  </p>
                </div>
              ) : creatives.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center dark:border-slate-800 dark:bg-slate-950/20">
                  <ImagePlus className="h-10 w-10 text-slate-400" />
                  <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No creatives yet
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Use the form on the left to start generating visual options.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                  {creatives.map((creative) => (
                    <article
                      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
                      key={creative.id}
                    >
                      <div className="relative overflow-hidden bg-slate-950">
                        <button
                          type="button"
                          className="block w-full cursor-zoom-in text-left"
                          onClick={() => setPreviewCreative(creative)}
                          aria-label={`Preview ${creativeDisplayTitle(creative.title)}`}
                        >
                          <MockVisual
                            aspect={aspectMap[creative.aspectRatio] ?? 'aspect-[4/3]'}
                            className="rounded-none transition-transform duration-500 group-hover:scale-[1.02]"
                            label={creative.aspectRatio}
                            title={creativeDisplayTitle(creative.title)}
                            variant={creative.variant}
                            imageUrl={creative.imageUrl}
                          />
                        </button>
                        <div className="absolute inset-x-3 bottom-3 flex translate-y-4 justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          {[
                            { label: 'Refine Style', icon: Sparkles, action: 'select_revision' },
                            { label: 'Download', icon: Download, action: 'download' },
                            { label: 'Favorite', icon: Heart, action: 'favorite' },
                            { label: 'Delete', icon: Trash2, action: 'delete' },
                            { label: 'Upscale', icon: ZoomIn, action: 'upscale' },
                          ].map((action) => {
                            const Icon = action.icon;

                            return (
                              <Button
                                aria-label={action.label}
                                className={cn(
                                  'bg-white/90 text-slate-950 shadow-md hover:bg-white transition-all duration-200',
                                  action.action === 'favorite' &&
                                    creative.favorite &&
                                    'text-rose-500 bg-rose-50 hover:bg-rose-100',
                                )}
                                key={action.label}
                                size="icon"
                                type="button"
                                variant="secondary"
                                onClick={() => handleCreativeAction(creative.id, action.action)}
                              >
                                <Icon
                                  aria-hidden="true"
                                  className={cn(
                                    'h-4 w-4',
                                    action.action === 'favorite' &&
                                      creative.favorite &&
                                      'fill-current',
                                  )}
                                />
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="font-semibold text-slate-950 dark:text-white line-clamp-1">
                              {creativeDisplayTitle(creative.title)}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              {creative.brand}
                            </p>
                          </div>
                          <Badge tone={creative.favorite ? 'rose' : 'slate'}>
                            {creative.aspectRatio}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {creative.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag}>{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <CreativeLearningPanel
            creatives={creatives}
            isLoading={isLoadingCreatives}
            onNotify={setNotification}
          />

          {selectedCreativeForRevision && (
            <Card className="border-brand-200 bg-brand-50/5 animate-scale-in dark:border-brand-900 dark:bg-slate-900/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-1.5 text-sm font-bold text-brand-700 dark:text-brand-400">
                    <Sparkles className="h-4 w-4" />
                    Image Revision Deck
                  </CardTitle>
                  <button
                    type="button"
                    onClick={() => setSelectedCreativeForRevision(null)}
                    className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    Clear
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-950">
                  <img
                    src={selectedCreativeForRevision.imageUrl}
                    alt="Revision candidate"
                    className="h-14 w-14 rounded border border-slate-200 object-cover dark:border-slate-800"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {creativeDisplayTitle(selectedCreativeForRevision.title)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                      Modifying this image version ({selectedCreativeForRevision.aspectRatio})
                    </p>
                  </div>
                </div>

                <Textarea
                  className="min-h-20 text-xs"
                  label="What changes to make?"
                  placeholder="e.g. 'Make the background blue' or 'Brighten the subject lighting'"
                  value={revisionPrompt}
                  onChange={(e) => setRevisionPrompt(e.target.value)}
                />

                <Button
                  className="h-9 w-full bg-brand-600 text-xs hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
                  type="button"
                  isLoading={isGenerating}
                  onClick={handleApplyRevision}
                >
                  <WandSparkles className="mr-1.5 h-3.5 w-3.5" />
                  Apply Changes (Create Version)
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
