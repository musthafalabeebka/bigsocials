import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Button from '../../components/Button';
import { toast } from 'sonner';
import { mockCampaignRequests, mockActiveCampaigns } from '../../data/mockData';
import { Calendar, DollarSign, Check, X, Send, Link as LinkIcon } from 'lucide-react';

const InfluencerCampaigns = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'active' ? 'active' : 'requests');
  const [requests, setRequests] = useState(mockCampaignRequests);
  const [campaigns, setCampaigns] = useState(mockActiveCampaigns);
  const [scriptContent, setScriptContent] = useState({});
  const [videoLink, setVideoLink] = useState({});

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'active' || tab === 'requests') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleRequest = (requestId, accepted) => {
    toast.success(accepted ? 'Campaign request accepted!' : 'Campaign request rejected');
    setRequests(requests.filter(r => r.id !== requestId));
    if (accepted) {
      const request = requests.find(r => r.id === requestId);
      setCampaigns([...campaigns, { ...request, deliverables: [{ id: 'new-1', phase: 'announcement', status: 'pending' }] }]);
    }
  };

  const submitScript = (deliverableId) => {
    if (!scriptContent[deliverableId]) {
      toast.error('Please write a script first');
      return;
    }
    toast.success('Script submitted for review!');
    // Update deliverable status
  };

  const submitVideo = (deliverableId) => {
    if (!videoLink[deliverableId]) {
      toast.error('Please provide a video link');
      return;
    }
    toast.success('Video link submitted!');
    // Update deliverable status
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1">
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 p-8">
          <h1 className="text-4xl font-heading font-bold text-on-surface mb-2">My Campaigns</h1>
          <p className="text-lg font-body text-muted-foreground">Manage requests and deliver content</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-outline-variant/20 px-8">
          <div className="flex gap-6">
            <button
              onClick={() => switchTab('requests')}
              className={`py-4 px-2 font-body font-semibold transition-all relative ${activeTab === 'requests' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-on-surface'}`}
            >
              Requests
              {requests.length > 0 && (
                <span className="absolute -top-1 -right-2 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center font-mono">
                  {requests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => switchTab('active')}
              className={`py-4 px-2 font-body font-semibold transition-all ${activeTab === 'active' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-on-surface'}`}
            >
              Active Campaigns
            </button>
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'requests' && (
            <div className="space-y-6">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <div key={request.id} className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6">
                    <div className="flex gap-6">
                      {request.campaign.poster_url && (
                        <img src={request.campaign.poster_url} alt={request.campaign.movie_title} className="w-32 h-48 object-cover rounded-lg" />
                      )}
                      <div className="flex-1">
                        <h3 className="text-2xl font-heading font-bold mb-2">{request.campaign.movie_title}</h3>
                        <p className="text-sm font-body text-muted-foreground mb-4">
                          {request.campaign.campaign_type.replace('_', ' ').toUpperCase()}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm font-body">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>Launch: {new Date(request.campaign.release_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-body">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono font-bold text-success">₹{request.cost.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-body text-muted-foreground mb-2">Campaign Brief:</p>
                          <p className="font-body">{request.campaign.campaign_brief}</p>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="primary"
                            onClick={() => handleRequest(request.id, true)}
                            data-testid={`accept-request-${request.id}`}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Accept Request
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleRequest(request.id, false)}
                            data-testid={`reject-request-${request.id}`}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-12 text-center">
                  <p className="text-lg font-body text-muted-foreground">No pending requests</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'active' && (
            <div className="space-y-6">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-6">
                  <div className="flex gap-6 mb-6">
                    {campaign.campaign.poster_url && (
                      <img src={campaign.campaign.poster_url} alt={campaign.campaign.movie_title} className="w-24 h-36 object-cover rounded-lg" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl font-heading font-bold mb-2">{campaign.campaign.movie_title}</h3>
                      <p className="text-sm font-body text-muted-foreground mb-2">
                        Payment: <span className="font-mono font-bold text-success">₹{campaign.cost.toLocaleString()}</span>
                      </p>
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="space-y-4">
                    <h4 className="font-heading font-bold text-lg">Deliverables</h4>
                    {campaign.deliverables.map((deliverable) => (
                      <div key={deliverable.id} className="bg-surface-container-low rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-body font-semibold capitalize">Phase: {deliverable.phase}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono uppercase mt-1 ${
                              deliverable.status === 'pending' ? 'bg-warning/10 text-warning' :
                              deliverable.status === 'submitted' ? 'bg-primary/10 text-primary' :
                              'bg-success/10 text-success'
                            }`}>
                              {deliverable.status}
                            </span>
                          </div>
                        </div>

                        {deliverable.status === 'pending' && (
                          <div>
                            <label className="block text-sm font-body font-semibold mb-2">Write Script</label>
                            <textarea
                              value={scriptContent[deliverable.id] || ''}
                              onChange={(e) => setScriptContent({ ...scriptContent, [deliverable.id]: e.target.value })}
                              className="w-full px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
                              rows="4"
                              placeholder="Write your script here..."
                            />
                            <Button
                              variant="primary"
                              className="mt-2"
                              onClick={() => submitScript(deliverable.id)}
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Submit Script
                            </Button>
                          </div>
                        )}

                        {deliverable.status === 'submitted' && deliverable.script_content && (
                          <div>
                            <p className="text-sm font-body text-muted-foreground mb-2">Submitted Script:</p>
                            <p className="font-body bg-surface-container-highest p-3 rounded-lg">{deliverable.script_content}</p>
                            <p className="text-sm font-body text-warning mt-2">Awaiting review...</p>
                          </div>
                        )}

                        {deliverable.status === 'approved' && (
                          <div>
                            <label className="block text-sm font-body font-semibold mb-2">Instagram Post Link</label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={videoLink[deliverable.id] || ''}
                                onChange={(e) => setVideoLink({ ...videoLink, [deliverable.id]: e.target.value })}
                                className="flex-1 px-4 py-3 rounded-lg bg-surface-container-highest border-2 border-transparent focus:border-primary focus:outline-none font-body"
                                placeholder="https://instagram.com/p/..."
                              />
                              <Button
                                variant="primary"
                                onClick={() => submitVideo(deliverable.id)}
                              >
                                <LinkIcon className="w-4 h-4 mr-2" />
                                Submit
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {campaigns.length === 0 && (
                <div className="bg-surface-container-lowest rounded-DEFAULT shadow-ambient p-12 text-center">
                  <p className="text-lg font-body text-muted-foreground">No active campaigns</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfluencerCampaigns;
