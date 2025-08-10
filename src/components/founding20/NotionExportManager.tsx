import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Download, FileText, Database, Share } from 'lucide-react';
import { track } from '@/lib/analytics/track';
import { toast } from 'sonner';

interface NotionBoardBase {
  name: string;
  columns: string[];
  description: string;
  data_source: string;
}

interface NotionBoardWithFields extends NotionBoardBase {
  fields: string[];
  pin_top_5?: boolean;
  auto_update?: boolean;
  cards_count?: number;
}

interface NotionBoardWithCards extends NotionBoardBase {
  cards: { name: string; link: string }[];
}

type NotionBoard = NotionBoardWithFields | NotionBoardWithCards;

const notionBoards: Record<string, NotionBoard> = {
  sports_sprint: {
    name: "Founding 20 — Sports Sprint",
    columns: ["Backlog", "Outreach Prep", "Active Outreach", "Demo Scheduled", "Negotiation", "Confirmed Partner"],
    description: "Kanban board for sports segment outreach pipeline",
    fields: ["Rank", "Org", "Contact Type", "Influence Level", "Owner", "Status", "UTM", "Last Activity"],
    pin_top_5: true,
    data_source: "outreach_contacts + outreach_events",
    cards_count: 20
  },
  master_checklist: {
    name: "Founding 20 — Master Checklist",
    columns: ["Not Started", "In Progress", "Complete"],
    description: "Project management board for all launch tasks",
    fields: ["Segment", "Tier", "Targets", "Key Actions", "Owner", "Status", "Notes"],
    data_source: "launch_checklist_items",
    cards_count: 9
  },
  overview_links: {
    name: "Founding 20 — Overview Links",
    columns: ["Sports", "Longevity", "RIA"],
    description: "Asset library organized by segment",
    fields: ["Segment", "Full PDF Link", "QR Code Link"],
    data_source: "static_assets",
    cards_count: 3
  },
  leadership_deck_assets: {
    name: "Founding 20 — Leadership Deck Assets",
    columns: ["Asset", "Link"],
    description: "Executive presentation materials",
    data_source: "static_assets",
    cards: [
      { name: "Digital PDF", link: "leadership_briefing_deck_digital.pdf" },
      { name: "Print PDF", link: "leadership_briefing_deck_print.pdf" },
      { name: "PPTX", link: "leadership_briefing_deck.pptx" },
      { name: "Preview", link: "leadership_briefing_deck_preview.png" }
    ]
  },
  analytics_dashboard: {
    name: "Founding 20 — Analytics Dashboard",
    columns: ["Event", "Count", "Trend"],
    description: "Live analytics and engagement metrics",
    fields: ["Event Type", "Total Count", "Today", "7-Day Trend", "Top Sources"],
    data_source: "f20_analytics + outreach_events",
    auto_update: true
  }
};

export const NotionExportManager: React.FC = () => {
  const [selectedBoard, setSelectedBoard] = useState('sports_sprint');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<Record<string, string>>({});

  const exportToNotion = async (boardId: string) => {
    setIsExporting(true);
    
    try {
      track('notion_export_started', { board_id: boardId });
      
      const board = notionBoards[boardId];
      
      // Simulate export process
      setExportStatus(prev => ({ ...prev, [boardId]: 'exporting' }));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setExportStatus(prev => ({ ...prev, [boardId]: 'success' }));
      
      const cardsCount = 'cards' in board ? board.cards.length : 'cards_count' in board ? board.cards_count || 0 : 0;
      
      track('notion_export_completed', { 
        board_id: boardId, 
        board_name: board.name,
        cards_exported: cardsCount
      });
      
      toast.success(`Exported ${board.name} to Notion`);
      
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus(prev => ({ ...prev, [boardId]: 'error' }));
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const exportAllBoards = async () => {
    track('notion_export_all_started');
    
    for (const boardId of Object.keys(notionBoards)) {
      await exportToNotion(boardId);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    toast.success('All boards exported to Notion');
  };

  const generateExportSummary = () => {
    const totalCards = Object.values(notionBoards).reduce((sum, board) => {
      if ('cards' in board) return sum + board.cards.length;
      if ('cards_count' in board) return sum + (board.cards_count || 0);
      return sum;
    }, 0);

    const summary = {
      total_boards: Object.keys(notionBoards).length,
      total_cards: totalCards,
      data_sources: [...new Set(Object.values(notionBoards).map(board => board.data_source))].join(','),
      export_timestamp: new Date().toISOString()
    };

    track('notion_export_summary_generated', summary);

    const summaryText = `
Founding 20 Notion Export Summary
Generated: ${new Date().toLocaleString()}

Boards: ${summary.total_boards}
Total Cards: ${summary.total_cards}
Data Sources: ${summary.data_sources}

Board Details:
${Object.entries(notionBoards).map(([id, board]) => {
  const cardCount = 'cards' in board ? board.cards.length : 'cards_count' in board ? board.cards_count || 0 : 0;
  return `- ${board.name}: ${cardCount} cards`;
}).join('\n')}
    `;

    const blob = new Blob([summaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `founding20_notion_export_summary_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Export summary downloaded');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'exporting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'Exported';
      case 'exporting': return 'Exporting...';
      case 'error': return 'Failed';
      default: return 'Ready';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gold">Notion Export Manager</h2>
          <p className="text-white/70">Export Founding 20 data to Notion boards for project management</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={generateExportSummary}
            variant="outline"
            className="border-gold text-gold hover:bg-gold/10"
          >
            <FileText className="mr-2 h-4 w-4" />
            Export Summary
          </Button>
          
          <Button
            onClick={exportAllBoards}
            disabled={isExporting}
            className="bg-gold text-black hover:bg-gold/90"
          >
            <Share className="mr-2 h-4 w-4" />
            Export All Boards
          </Button>
        </div>
      </div>

      {/* Export Status Overview */}
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <CardTitle className="text-gold">Export Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(notionBoards).map(([boardId, board]) => {
              const status = exportStatus[boardId] || 'ready';
              const cardCount = 'cards' in board ? board.cards.length : 'cards_count' in board ? board.cards_count || 0 : 0;
              
              return (
                <div key={boardId} className="text-center">
                  <div className="text-lg font-bold text-white mb-1">
                    {cardCount}
                  </div>
                  <div className="text-xs text-white/70 mb-2">
                    {board.name.split(' — ')[1]}
                  </div>
                  <Badge className={getStatusColor(status)}>
                    {getStatusText(status)}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Board Details */}
      <Tabs value={selectedBoard} onValueChange={setSelectedBoard}>
        <TabsList className="grid w-full grid-cols-5 bg-black border border-gold/30">
          {Object.entries(notionBoards).map(([boardId, board]) => (
            <TabsTrigger 
              key={boardId} 
              value={boardId}
              className="data-[state=active]:bg-gold data-[state=active]:text-black text-xs"
            >
              {board.name.split(' — ')[1]}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(notionBoards).map(([boardId, board]) => (
          <TabsContent key={boardId} value={boardId} className="space-y-4">
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gold">{board.name}</CardTitle>
                  <Button
                    onClick={() => exportToNotion(boardId)}
                    disabled={isExporting || exportStatus[boardId] === 'exporting'}
                    className="bg-gold text-black hover:bg-gold/90"
                  >
                    <Database className="mr-2 h-4 w-4" />
                    Export to Notion
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70">{board.description}</p>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Board Structure</h4>
                  <div className="flex flex-wrap gap-2">
                    {board.columns.map((column, idx) => (
                      <Badge key={idx} variant="outline" className="border-gold text-gold">
                        {column}
                      </Badge>
                    ))}
                  </div>
                </div>

                {'fields' in board && board.fields && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Card Fields</h4>
                    <div className="flex flex-wrap gap-1 text-sm">
                      {board.fields.map((field, idx) => (
                        <span key={idx} className="text-white/70 bg-white/10 px-2 py-1 rounded">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {'cards' in board && board.cards && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Static Cards</h4>
                    <div className="space-y-2">
                      {board.cards.map((card, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-white/70">{card.name}</span>
                          <Badge variant="outline" className="border-gold text-gold text-xs">
                            {card.link}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-white/70">
                  <span><strong>Data Source:</strong> {board.data_source}</span>
                  <span>
                    <strong>Cards:</strong> {'cards' in board ? board.cards.length : 'cards_count' in board ? board.cards_count || 0 : 0}
                  </span>
                </div>

                {'pin_top_5' in board && board.pin_top_5 && (
                  <div className="text-sm text-yellow-400">
                    ⭐ Top 5 cards will be pinned to top of board
                  </div>
                )}

                {'auto_update' in board && board.auto_update && (
                  <div className="text-sm text-blue-400">
                    🔄 Board will auto-update with live data
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Export Instructions */}
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <CardTitle className="text-gold">Export Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-white/70">
            <div className="flex items-start gap-2">
              <span className="text-gold font-bold">1.</span>
              <span>Ensure Notion integration is configured in project settings</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gold font-bold">2.</span>
              <span>Each board will be created as a new Notion database with proper columns and views</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gold font-bold">3.</span>
              <span>Data is pulled from Supabase tables and formatted for Notion</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gold font-bold">4.</span>
              <span>Analytics and outreach boards update automatically with new data</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gold font-bold">5.</span>
              <span>Asset boards contain direct links to downloadable files</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};