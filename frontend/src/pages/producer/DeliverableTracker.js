import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import { toast } from 'sonner';
import { Plus, CheckCircle, XCircle, Clock, Send, Eye } from 'lucide-react';
import { deliverableAPI } from '../../services/api';

const DeliverableTracker = () => {
  const { id } = useParams();
  const [tracker, setTracker] = useState({
    newly_added: [],
    pending: [],
    submitted: [],
    accepted: [],
    rejected: [],
    live: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);

  useEffect(() => {
    fetchTracker();
  }, [id]);

  const fetchTracker = async () => {
    try {
      const res = await deliverableAPI.getTracker(id);
      setTracker(res.data);
    } catch (error) {
      toast.error('Failed to load tracker');
    } finally {
      setLoading(false);
    }
  };

  const StatusCard = ({ title, items, icon: Icon, color, bgColor }) => (
    <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg">{title}</h3>
          <p className="text-sm font-mono text-muted-foreground">{items.length} deliverables</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {items.length > 0 ? items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedDeliverable(item)}
            className="w-full p-4 bg-surface-container-low rounded-lg text-left transition-all hover:shadow-ambient hover:ring-2 hover:ring-primary/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body font-semibold">{item.influencer?.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{item.phase}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  @{item.influencer?.instagram_handle?.replace('@', '') || 'creator'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-muted-foreground">
                  Open
                </span>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </button>
        )) : (
          <p className="text-sm text-muted-foreground text-center py-4">No items</p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1">
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 p-8">
          <h1 className="text-4xl font-heading font-bold text-on-surface mb-2">
            Deliverable Tracker
          </h1>
          <p className="text-lg font-body text-muted-foreground">
            Track all influencer submissions and reviews
          </p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatusCard
            title="Newly Added"
            items={tracker.newly_added}
            icon={Plus}
            color="text-primary"
            bgColor="bg-primary/10"
          />
          <StatusCard
            title="Pending Submission"
            items={tracker.pending}
            icon={Clock}
            color="text-warning"
            bgColor="bg-warning/10"
          />
          <StatusCard
            title="Submitted for Review"
            items={tracker.submitted}
            icon={Send}
            color="text-primary"
            bgColor="bg-primary/10"
          />
          <StatusCard
            title="Accepted"
            items={tracker.accepted}
            icon={CheckCircle}
            color="text-success"
            bgColor="bg-success/10"
          />
          <StatusCard
            title="Rejected"
            items={tracker.rejected}
            icon={XCircle}
            color="text-error"
            bgColor="bg-error/10"
          />
          <StatusCard
            title="Live"
            items={tracker.live}
            icon={CheckCircle}
            color="text-success"
            bgColor="bg-success/10"
          />
        </div>

        {selectedDeliverable && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-2xl rounded-DEFAULT bg-surface-container-lowest p-6 shadow-ambient-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-on-surface">
                    Deliverable Details
                  </h2>
                  <p className="text-sm font-body text-muted-foreground mt-1">
                    {selectedDeliverable.influencer?.name} • {selectedDeliverable.phase}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDeliverable(null)}>
                  Close
                </Button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg bg-surface-container-low p-4">
                  <p className="text-xs font-mono uppercase text-muted-foreground">Influencer</p>
                  <p className="mt-2 font-body font-semibold">{selectedDeliverable.influencer?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    @{selectedDeliverable.influencer?.instagram_handle?.replace('@', '') || 'creator'}
                  </p>
                </div>
                <div className="rounded-lg bg-surface-container-low p-4">
                  <p className="text-xs font-mono uppercase text-muted-foreground">Status</p>
                  <p className="mt-2 font-body font-semibold capitalize">{selectedDeliverable.status}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    Phase: {selectedDeliverable.phase}
                  </p>
                </div>
                <div className="rounded-lg bg-surface-container-low p-4 md:col-span-2">
                  <p className="text-xs font-mono uppercase text-muted-foreground">Script Content</p>
                  <p className="mt-2 text-sm font-body text-on-surface">
                    {selectedDeliverable.script_content || 'No script submitted yet.'}
                  </p>
                </div>
                <div className="rounded-lg bg-surface-container-low p-4 md:col-span-2">
                  <p className="text-xs font-mono uppercase text-muted-foreground">Video Link</p>
                  <p className="mt-2 text-sm font-body text-on-surface break-all">
                    {selectedDeliverable.video_link || 'No live or submitted video link yet.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliverableTracker;
