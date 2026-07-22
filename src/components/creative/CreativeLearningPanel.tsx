import { useEffect, useMemo, useState } from 'react';
import { BarChart3, MessageSquareText, Save } from 'lucide-react';

import {
  creativeService,
  type CreativeFeedbackSignalType,
  type CreativeItem,
  type CreativeLearningSummary,
} from '@/services/creative.service';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Textarea,
} from '@/components/ui';
import { creativeDisplayTitle } from '@/utils/creativeDisplay';

interface NotificationPayload {
  message: string;
  title: string;
  tone: 'success' | 'info';
}

interface CreativeLearningPanelProps {
  creatives: CreativeItem[];
  isLoading?: boolean;
  onNotify: (notification: NotificationPayload) => void;
}

const feedbackOptions: Array<{ label: string; value: CreativeFeedbackSignalType }> = [
  { label: 'Like', value: 'like' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Dislike', value: 'dislike' },
  { label: 'Manual note', value: 'manual_note' },
];

function numberValue(value: string) {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function scoreLabel(summary: CreativeLearningSummary | null) {
  if (!summary) {
    return 'No score yet';
  }

  return summary.summary.aggregateScore.toFixed(1);
}

export function CreativeLearningPanel({
  creatives,
  isLoading = false,
  onNotify,
}: CreativeLearningPanelProps) {
  const [selectedCreativeId, setSelectedCreativeId] = useState(creatives[0]?.id ?? '');
  const [signalType, setSignalType] = useState<CreativeFeedbackSignalType>('like');
  const [comment, setComment] = useState('');
  const [platform, setPlatform] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [reach, setReach] = useState('');
  const [clicks, setClicks] = useState('');
  const [conversions, setConversions] = useState('');
  const [ctr, setCtr] = useState('');
  const [summary, setSummary] = useState<CreativeLearningSummary | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);
  const [isSavingMetrics, setIsSavingMetrics] = useState(false);

  const selectedCreative = useMemo(
    () => creatives.find((creative) => creative.id === selectedCreativeId),
    [creatives, selectedCreativeId],
  );

  useEffect(() => {
    if (!creatives.length) {
      setSelectedCreativeId('');
      setSummary(null);
      return;
    }

    if (!selectedCreativeId || !creatives.some((creative) => creative.id === selectedCreativeId)) {
      setSelectedCreativeId(creatives[0]?.id ?? '');
    }
  }, [creatives, selectedCreativeId]);

  useEffect(() => {
    if (!selectedCreativeId) {
      return;
    }

    setIsLoadingSummary(true);
    creativeService
      .getLearningSummary(selectedCreativeId)
      .then((response) => {
        if (response.data.data) {
          setSummary(response.data.data);
        }
      })
      .catch(() => setSummary(null))
      .finally(() => setIsLoadingSummary(false));
  }, [selectedCreativeId]);

  const refreshSummary = () => {
    if (!selectedCreativeId) {
      return;
    }

    creativeService
      .getLearningSummary(selectedCreativeId)
      .then((response) => {
        if (response.data.data) {
          setSummary(response.data.data);
        }
      })
      .catch(() => setSummary(null));
  };

  const handleFeedbackSubmit = () => {
    if (!selectedCreative) {
      return;
    }

    setIsSavingFeedback(true);
    creativeService
      .createFeedback(selectedCreative.id, {
        comment,
        metadata: {
          promptGenerationId: selectedCreative.promptGenerationId,
          source: 'creative_learning_panel',
        },
        signalType,
      })
      .then(() => {
        setComment('');
        refreshSummary();
        onNotify({
          title: 'Feedback Captured',
          message: 'This creative signal was saved for future learning.',
          tone: 'success',
        });
      })
      .catch(() => {
        onNotify({
          title: 'Feedback Failed',
          message: 'Could not save feedback for this creative.',
          tone: 'info',
        });
      })
      .finally(() => setIsSavingFeedback(false));
  };

  const handleMetricsSubmit = () => {
    if (!selectedCreative) {
      return;
    }

    setIsSavingMetrics(true);
    creativeService
      .recordMetrics(selectedCreative.id, {
        campaignName,
        clicks: numberValue(clicks),
        conversions: numberValue(conversions),
        ctr: numberValue(ctr),
        platform,
        rawMetrics: {
          source: 'creative_learning_panel',
        },
        reach: numberValue(reach),
      })
      .then(() => {
        setReach('');
        setClicks('');
        setConversions('');
        setCtr('');
        refreshSummary();
        onNotify({
          title: 'Metrics Captured',
          message: 'Campaign performance was saved for this creative.',
          tone: 'success',
        });
      })
      .catch(() => {
        onNotify({
          title: 'Metrics Failed',
          message: 'Could not save campaign performance for this creative.',
          tone: 'info',
        });
      })
      .finally(() => setIsSavingMetrics(false));
  };

  if (isLoading || !creatives.length) {
    return (
      <Card>
        <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle>Learning Capture</CardTitle>
            <CardDescription>
              Save approval signals and campaign performance for generated creatives.
            </CardDescription>
          </div>
          <div className="rounded-lg border border-slate-200 px-3 py-2 text-right dark:border-slate-800">
            <p className="text-xs font-medium uppercase text-slate-400">Aggregate score</p>
            <p className="text-lg font-semibold text-slate-950 dark:text-white">
              {isLoading ? '...' : 'No score yet'}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-950/20">
            <MessageSquareText className="h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {isLoading ? 'Loading feedback tools...' : 'No creative selected'}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {isLoading
                ? 'Creative feedback will appear after generated images load.'
                : 'Generate or load a creative before saving feedback.'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <CardTitle>Learning Capture</CardTitle>
          <CardDescription>Save approval signals and campaign performance for generated creatives.</CardDescription>
        </div>
        <div className="rounded-lg border border-slate-200 px-3 py-2 text-right dark:border-slate-800">
          <p className="text-xs font-medium uppercase text-slate-400">Aggregate score</p>
          <p className="text-lg font-semibold text-slate-950 dark:text-white">
            {isLoadingSummary ? '...' : scoreLabel(summary)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <Select
          label="Creative"
          options={creatives.map((creative) => ({
            label: `${creativeDisplayTitle(creative.title)} - ${creative.aspectRatio}`,
            value: creative.id,
          }))}
          value={selectedCreativeId}
          onChange={(event) => setSelectedCreativeId(event.target.value)}
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <MessageSquareText className="h-4 w-4 text-brand-500" />
              Feedback
            </div>
            <Select
              label="Signal"
              options={feedbackOptions}
              value={signalType}
              onChange={(event) => setSignalType(event.target.value as CreativeFeedbackSignalType)}
            />
            <Textarea
              label="Reason"
              placeholder="Example: strong CTA, warm food lighting, got 1000+ reach"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <Button
              isLoading={isSavingFeedback}
              type="button"
              onClick={handleFeedbackSubmit}
              disabled={!selectedCreative}
            >
              <Save className="h-4 w-4" />
              Save feedback
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <BarChart3 className="h-4 w-4 text-brand-500" />
              Metrics
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Platform" value={platform} onChange={(event) => setPlatform(event.target.value)} />
              <Input
                label="Campaign"
                value={campaignName}
                onChange={(event) => setCampaignName(event.target.value)}
              />
              <Input label="Reach" inputMode="numeric" value={reach} onChange={(event) => setReach(event.target.value)} />
              <Input
                label="Clicks"
                inputMode="numeric"
                value={clicks}
                onChange={(event) => setClicks(event.target.value)}
              />
              <Input
                label="Conversions"
                inputMode="numeric"
                value={conversions}
                onChange={(event) => setConversions(event.target.value)}
              />
              <Input label="CTR %" inputMode="decimal" value={ctr} onChange={(event) => setCtr(event.target.value)} />
            </div>
            <Button
              isLoading={isSavingMetrics}
              type="button"
              variant="secondary"
              onClick={handleMetricsSubmit}
              disabled={!selectedCreative}
            >
              <Save className="h-4 w-4" />
              Save metrics
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
