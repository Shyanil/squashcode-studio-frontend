import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Copy, Download, ImagePlus, Save, Send, Sparkles, WandSparkles } from 'lucide-react';

import { MockVisual } from '@/components/common';
import { Header } from '@/components/layout/Header';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
  Upload,
} from '@/components/ui';
import { cn } from '@/utils/cn';
import { creativeDisplayTitle } from '@/utils/creativeDisplay';
import {
  promptService,
  type PromptMessage,
  type PromptSession,
  type PromptSourceType,
} from '@/services/prompt.service';

type MessageRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: MessageRole;
  title: string;
  text: string;
}

interface SupportingAssetPreview {
  id: string;
  name: string;
  url?: string;
}

const savedPromptKey = 'squashcode-prompt-generator-save';

const starterMessages: ChatMessage[] = [
  {
    id: 'assistant-intro',
    role: 'assistant',
    title: 'Creative Director',
    text: 'Start by uploading a reference creative or describe the creative you want. I will build one shared creative direction before generating JSON.',
  },
];

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Unable to read image.'));
    });
    reader.addEventListener('error', () =>
      reject(reader.error ?? new Error('Unable to read image.')),
    );
    reader.readAsDataURL(file);
  });
}

function toChatMessage(message: PromptMessage): ChatMessage | null {
  if (message.role === 'system') {
    return null;
  }

  return {
    id: message.id,
    role: message.role,
    title: message.role === 'user' ? 'You' : 'Creative Director',
    text: message.content,
  };
}

function displayError(error: unknown) {
  if (typeof error === 'object' && error !== null) {
    const record = error as {
      code?: unknown;
      message?: unknown;
      response?: { data?: { message?: unknown } };
    };
    const apiMessage = record.response?.data?.message;

    if (typeof apiMessage === 'string' && apiMessage.trim()) {
      return apiMessage;
    }

    if (record.code === 'ERR_NETWORK') {
      return 'API server is not reachable. Start the backend and try again.';
    }

    if (typeof record.message === 'string' && record.message.trim()) {
      return record.message;
    }
  }

  return 'Something went wrong while updating the prompt session.';
}

type StatusKind = 'info' | 'success' | 'error';

const statusStyles: Record<StatusKind, string> = {
  info: 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
  error:
    'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200',
};

const statusDotStyles: Record<StatusKind, string> = {
  info: 'bg-slate-400',
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
};

export default function PromptGeneratorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [jsonName, setJsonName] = useState('');
  const [promptText, setPromptText] = useState('');
  const [generatedJson, setGeneratedJson] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [session, setSession] = useState<PromptSession | null>(null);
  const [additionalAssets, setAdditionalAssets] = useState<SupportingAssetPreview[]>([]);
  const [creativeContext, setCreativeContext] = useState<Record<string, unknown>>({});
  const [statusText, setStatusText] = useState('Start with an image or chat');
  const [statusKind, setStatusKind] = useState<StatusKind>('info');
  const [saved, setSaved] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploadingAssets, setIsUploadingAssets] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const activeAnalyzeSignatureRef = useRef<string | null>(null);
  const isSendingRef = useRef(false);
  const isGeneratingRef = useRef(false);

  const updateStatus = (text: string, kind: StatusKind = 'info') => {
    setStatusText(text);
    setStatusKind(kind);
  };

  const fileSummary = useMemo(() => {
    if (!selectedFile) {
      return 'You can also start from chat only.';
    }

    const sizeMb = (selectedFile.size / (1024 * 1024)).toFixed(2);
    return `${selectedFile.name} · ${sizeMb} MB`;
  }, [selectedFile]);

  const displayJson = useMemo(() => {
    if (generatedJson) {
      return generatedJson;
    }

    return JSON.stringify(
      {
        schema: 'squashcode.creative_prompt.v1',
        title: jsonName.trim() || 'Example Creative Prompt',
        campaign: {
          industry: 'Real Estate',
          type: 'Premium property campaign',
          goal: 'Generate qualified enquiries',
        },
        visualDirection: {
          styleReference: selectedFile
            ? 'Use the uploaded style reference image'
            : 'Upload a style reference image if needed',
          composition: 'Clean hero, concise proof points, clear CTA',
        },
        copy: {
          headlineDirection: 'Short benefit-led headline',
          cta: 'Enquire Now',
        },
      },
      null,
      2,
    );
  }, [generatedJson, jsonName, selectedFile]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [selectedFile]);

  const syncSessionName = async (workingSession: PromptSession) => {
    const requestedName = jsonName.trim();

    if (!requestedName || creativeDisplayTitle(workingSession.title) === creativeDisplayTitle(requestedName)) {
      return workingSession;
    }

    const response = await promptService.updateSession(workingSession.id, {
      title: requestedName,
    });
    const updatedSession = response.data.data;
    setSession(updatedSession);
    setCreativeContext(updatedSession.creativeContext);

    return updatedSession;
  };

  const ensureSession = async (sourceType: PromptSourceType) => {
    if (session) {
      return syncSessionName(session);
    }

    const response = await promptService.createSession({
      title: jsonName.trim() || undefined,
      sourceType,
    });
    const detail = response.data.data;
    setSession(detail.session);
    setCreativeContext(detail.session.creativeContext);

    return detail.session;
  };

  const appendMessages = (nextMessages: Array<PromptMessage | null | undefined>) => {
    const mappedMessages = nextMessages
      .map((message) => (message ? toChatMessage(message) : null))
      .filter((message): message is ChatMessage => Boolean(message));

    if (!mappedMessages.length) {
      return;
    }

    setMessages((current) => {
      const nextMessages = mappedMessages.filter((message) => {
        return !current.some(
          (existing) =>
            existing.id === message.id ||
            (existing.role === message.role &&
              existing.title === message.title &&
              existing.text === message.text),
        );
      });

      return nextMessages.length ? [...current, ...nextMessages] : current;
    });
  };

  const analyzeFile = async (file: File) => {
    const fileSignature = `${file.name}:${file.size}:${file.lastModified}`;

    if (activeAnalyzeSignatureRef.current === fileSignature) {
      return;
    }

    activeAnalyzeSignatureRef.current = fileSignature;
    setIsAnalyzing(true);
    setSaved(false);
    updateStatus('Analyzing image...', 'info');

    try {
      const workingSession = await ensureSession('image');
      const dataUrl = await fileToDataUrl(file);
      const response = await promptService.analyzeImage(workingSession.id, {
        image: {
          dataUrl,
          fileName: file.name,
          mimeType: file.type || 'image/*',
          size: file.size,
        },
        promptText: promptText.trim() || undefined,
      });
      const result = response.data.data;

      setSession(result.session);
      setCreativeContext(result.session.creativeContext);
      appendMessages([result.assistantMessage]);
      setGeneratedJson('');
      updateStatus('Image analyzed and creative context updated', 'success');
    } catch (error) {
      updateStatus(displayError(error), 'error');
    } finally {
      activeAnalyzeSignatureRef.current = null;
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    setSelectedFile(nextFile);

    if (nextFile) {
      void analyzeFile(nextFile);
    }
  };

  const sendPromptToSession = async (workingSession: PromptSession, content: string) => {
    const hadGeneratedJson = Boolean(generatedJson);
    const response = await promptService.sendMessage(workingSession.id, { content });
    const result = response.data.data;

    setSession(result.session);
    setCreativeContext(result.session.creativeContext);
    appendMessages([result.userMessage, result.assistantMessage]);
    setGeneratedJson('');
    setSaved(false);
    updateStatus(
      hadGeneratedJson
        ? 'Draft updated from chat. Generate JSON again to rewrite the final output.'
        : 'Creative context updated from chat',
      'success',
    );

    return result.session;
  };

  const handleSend = async () => {
    if (isSendingRef.current) {
      return;
    }

    const trimmedPrompt = promptText.trim();

    if (!trimmedPrompt) {
      updateStatus('Type a message before sending.', 'error');
      return;
    }

    isSendingRef.current = true;
    setIsSending(true);
    updateStatus('Sending message...', 'info');

    try {
      const workingSession = await ensureSession(selectedFile ? 'mixed' : 'text');
      await sendPromptToSession(workingSession, trimmedPrompt);
      setPromptText('');
    } catch (error) {
      updateStatus(displayError(error), 'error');
    } finally {
      isSendingRef.current = false;
      setIsSending(false);
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile) {
      updateStatus('Upload an image first, or use Generate JSON for chat-only mode.', 'error');
      return;
    }

    void analyzeFile(selectedFile);
  };

  const handleAdditionalFilesChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (!files.length) {
      return;
    }

    setIsUploadingAssets(true);
    setSaved(false);
    updateStatus('Uploading supporting images...', 'info');

    try {
      const workingSession = await ensureSession('mixed');
      const uploadedAssets: SupportingAssetPreview[] = [];

      for (const file of files) {
        const dataUrl = await fileToDataUrl(file);
        const response = await promptService.addAsset(workingSession.id, {
          assetRole: 'supporting_reference',
          image: {
            dataUrl,
            fileName: file.name,
            mimeType: file.type || 'image/*',
            size: file.size,
          },
        });
        const result = response.data.data;
        setSession(result.session);
        uploadedAssets.push({
          id: result.asset.id,
          name: result.asset.fileName,
          url: result.asset.url,
        });
      }

      setAdditionalAssets((current) => [...uploadedAssets, ...current]);
      setGeneratedJson('');
      updateStatus(
        `${uploadedAssets.length} supporting image(s) attached to this JSON session`,
        'success',
      );
    } catch (error) {
      updateStatus(displayError(error), 'error');
    } finally {
      setIsUploadingAssets(false);
    }
  };

  const handleGenerateJson = async () => {
    if (isGeneratingRef.current) {
      return;
    }

    isGeneratingRef.current = true;
    setIsGenerating(true);
    updateStatus('Generating JSON...', 'info');

    try {
      let workingSession = await ensureSession(selectedFile ? 'mixed' : 'text');
      const trimmedPrompt = promptText.trim();

      if (trimmedPrompt) {
        workingSession = await sendPromptToSession(workingSession, trimmedPrompt);
        setPromptText('');
      }

      const response = await promptService.generateSessionJson(workingSession.id, {
        outputOptions: {
          aspectRatio:
            typeof creativeContext.aspectRatio === 'string'
              ? creativeContext.aspectRatio
              : undefined,
          quality: 'high',
          imageCount: 1,
        },
      });
      const result = response.data.data;
      const nextJson = JSON.stringify(result.generation.generatedJson, null, 2);

      setSession(result.session);
      if (!jsonName.trim()) {
        setJsonName(result.session.title);
      }
      setCreativeContext(result.session.creativeContext);
      setGeneratedJson(nextJson);
      setSaved(true);
      updateStatus(`Generated JSON v${result.generation.versionNumber} saved`, 'success');
    } catch (error) {
      updateStatus(displayError(error), 'error');
    } finally {
      isGeneratingRef.current = false;
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedJson);
    updateStatus('JSON copied', 'success');
  };

  const handleDownload = () => {
    const blob = new Blob([generatedJson], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'squashcode-prompt.json';
    link.click();
    URL.revokeObjectURL(url);
    updateStatus('JSON downloaded', 'success');
  };

  const handleSave = () => {
    window.localStorage.setItem(savedPromptKey, generatedJson);
    setSaved(true);
    updateStatus('JSON version saved locally and already saved in session', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Header
        description="Upload an image or chat first, then generate structured JSON when ready."
        title="JSON Prompt Generator"
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-stretch">
        <Card className="overflow-hidden xl:self-stretch">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Image + Chat Interface</CardTitle>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Use either a reference creative or a chat-only brief. Both update one shared
                creative context.
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
              <Sparkles aria-hidden="true" className="h-5 w-5" />
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <Input
              label="JSON name"
              placeholder="Example: Subham Kishori Heights campaign"
              value={jsonName}
              onChange={(event) => setJsonName(event.target.value)}
            />

            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <Upload
                accept="image/*"
                className="min-h-52"
                description="PNG, JPG, or WebP reference image"
                label={isAnalyzing ? 'Analyzing Image' : 'Upload Image'}
                onChange={handleFileChange}
              />
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">
                      Reference preview
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{fileSummary}</p>
                  </div>
                  <span className="inline-flex w-fit shrink-0 items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span
                      aria-hidden="true"
                      className={
                        selectedFile
                          ? 'h-2 w-2 rounded-full bg-emerald-500'
                          : 'h-2 w-2 rounded-full bg-slate-400'
                      }
                    />
                    {selectedFile ? 'Uploaded' : 'Image first'}
                  </span>
                </div>
                {previewUrl ? (
                  <div className="overflow-hidden rounded-lg border border-white/60 bg-white shadow-sm">
                    <img
                      alt={selectedFile?.name ?? 'Uploaded reference'}
                      className="h-64 w-full object-cover"
                      src={previewUrl}
                    />
                  </div>
                ) : (
                  <MockVisual
                    aspect="aspect-[4/3] sm:aspect-[16/9]"
                    className="min-h-56"
                    label="Reference Image"
                    title="Upload a reference or start from chat"
                    variant="mint"
                  />
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                    Supporting Images
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Add logos, product shots, packaging, or extra style references for this same
                    JSON.
                  </p>
                </div>
                <span
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 ring-inset transition-colors',
                    additionalAssets.length > 0
                      ? 'bg-brand-50 text-brand-700 ring-brand-500/20 dark:bg-brand-950 dark:text-brand-100 dark:ring-brand-500/30'
                      : 'bg-slate-50 text-slate-500 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700',
                  )}
                >
                  <ImagePlus aria-hidden="true" className="h-3.5 w-3.5" />
                  {additionalAssets.length} attached
                </span>
              </div>

              <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <Upload
                  accept="image/*"
                  className="min-h-36"
                  description="Logo, product, packaging, or extra reference images"
                  label={isUploadingAssets ? 'Uploading Images' : 'Add More Images'}
                  multiple
                  onChange={handleAdditionalFilesChange}
                />
                <div className="min-h-36 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                  {additionalAssets.length ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {additionalAssets.map((asset) => (
                        <div
                          className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
                          key={asset.id}
                        >
                          <div className="flex aspect-square items-center justify-center bg-slate-950">
                            {asset.url ? (
                              <img
                                alt={asset.name}
                                className="h-full w-full object-contain"
                                src={asset.url}
                              />
                            ) : (
                              <ImagePlus aria-hidden="true" className="h-6 w-6 text-slate-500" />
                            )}
                          </div>
                          <p className="truncate px-2 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                            {asset.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full min-h-28 flex-col items-center justify-center text-center">
                      <ImagePlus aria-hidden="true" className="h-7 w-7 text-slate-400" />
                      <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        No supporting images yet
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        The main uploaded ad remains the primary reference.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-950 dark:text-white">Chat</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Refine what to keep, remove, improve, or generate from scratch.
                  </p>
                </div>
                <Button
                  className="self-start"
                  isLoading={isAnalyzing}
                  size="sm"
                  type="button"
                  variant="secondary"
                  onClick={handleAnalyze}
                >
                  <WandSparkles aria-hidden="true" className="h-4 w-4" />
                  Analyze image
                </Button>
              </div>

              <div className="max-h-[340px] space-y-3 overflow-auto pr-1">
                {messages.map((message) => (
                  <div
                    className={[
                      'max-w-[92%] rounded-2xl border px-4 py-3 text-sm leading-6 shadow-sm',
                      message.role === 'user'
                        ? 'ml-auto border-brand-200 bg-brand-50 text-slate-800 dark:border-brand-900 dark:bg-brand-950 dark:text-brand-50'
                        : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200',
                    ].join(' ')}
                    key={message.id}
                  >
                    <p className="font-semibold text-slate-950 dark:text-white">{message.title}</p>
                    <p className="mt-1">{message.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <Textarea
                  className="min-h-24 border-0 bg-slate-50 focus:border-0 dark:bg-slate-950"
                  onChange={(event) => setPromptText(event.target.value)}
                  placeholder="Tell the assistant what to generate, what to keep from the image, or what to improve..."
                  value={promptText}
                />
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    className="w-full sm:w-auto"
                    isLoading={isSending}
                    type="button"
                    onClick={handleSend}
                  >
                    <Send aria-hidden="true" className="h-4 w-4" />
                    Send
                  </Button>
                  <Button
                    className="w-full sm:w-auto"
                    isLoading={isGenerating}
                    type="button"
                    variant="secondary"
                    onClick={handleGenerateJson}
                  >
                    Generate JSON
                  </Button>
                </div>
                <div
                  className={[
                    'mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-sm leading-5',
                    statusStyles[statusKind],
                  ].join(' ')}
                  role={statusKind === 'error' ? 'alert' : 'status'}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                      statusDotStyles[statusKind],
                    ].join(' ')}
                  />
                  <span>
                    {statusText}
                    {session ? ` · ${creativeDisplayTitle(session.title)}` : ''}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex h-full min-h-[760px] flex-col overflow-hidden">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-100">
                    <WandSparkles aria-hidden="true" className="h-4 w-4" />
                  </div>
                  <CardTitle>Generated JSON</CardTitle>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {statusText}
                  {session ? ` · ${creativeDisplayTitle(session.title)}` : ''}
                  {saved ? ' · saved' : ''}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                disabled={!generatedJson}
                size="sm"
                type="button"
                variant="secondary"
                onClick={handleCopy}
              >
                <Copy aria-hidden="true" className="h-3.5 w-3.5" />
                Copy
              </Button>
              <Button
                disabled={!generatedJson}
                size="sm"
                type="button"
                variant="secondary"
                onClick={handleDownload}
              >
                <Download aria-hidden="true" className="h-3.5 w-3.5" />
                Download
              </Button>
              <Button
                className={cn(
                  saved
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:text-white'
                    : '',
                )}
                disabled={!generatedJson}
                size="sm"
                type="button"
                onClick={handleSave}
              >
                <Save aria-hidden="true" className="h-3.5 w-3.5" />
                {saved ? 'Saved' : 'Save'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1">
            <pre className="h-full min-h-[640px] w-full flex-1 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm leading-relaxed text-emerald-100 shadow-inner">
              <code>{displayJson}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
