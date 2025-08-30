"use client";

import { CheckCircle2, Clock, RefreshCw, Truck, XCircle, Package, Receipt } from "lucide-react";

type Event = { id: string; type: string; message: string; created_at: string };

function rel(d: string | number | Date) {
  const dt = new Date(d).getTime();
  const diff = Date.now() - dt;
  const s = Math.round(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d2 = Math.round(h / 24);
  return `${d2}d ago`;
}

const iconFor: Record<string, JSX.Element> = {
  status_change: <RefreshCw className="h-4 w-4" />,
  webhook: <Receipt className="h-4 w-4" />,
  manual_action: <Package className="h-4 w-4" />,
  item_added: <CheckCircle2 className="h-4 w-4" />,
  item_removed: <XCircle className="h-4 w-4" />,
  item_updated: <RefreshCw className="h-4 w-4" />,
  shipped: <Truck className="h-4 w-4" />,
  default: <Clock className="h-4 w-4" />,
};

export default function StatusTimeline({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return <div className="text-sm text-muted-foreground">No events yet.</div>
  }
  return (
    <div className="space-y-3">
      {events.map((ev) => (
        <div key={ev.id} className="flex items-start gap-3">
          <div className="mt-0.5 text-muted-foreground">{iconFor[ev.type] ?? iconFor.default}</div>
          <div className="flex-1">
            <div className="text-sm">{ev.message}</div>
            <div className="text-xs text-muted-foreground">{rel(ev.created_at)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
