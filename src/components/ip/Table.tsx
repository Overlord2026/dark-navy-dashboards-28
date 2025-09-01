import React from 'react';
import { IPFiling } from '@/lib/db/ip';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText, Calendar, Hash, Building } from 'lucide-react';

interface IPTableProps {
  filings: IPFiling[];
  loading?: boolean;
}

export function IPTable({ filings, loading }: IPTableProps) {
  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'filed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'granted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getKindColor = (kind: string) => {
    switch (kind) {
      case 'PROVISIONAL':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'NONPROVISIONAL':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'PCT':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'OTHER':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const renderArtifactLinks = (filing: IPFiling) => {
    const artifacts = [
      filing.artifact_url_1,
      filing.artifact_url_2,
      filing.artifact_url_3,
      filing.artifact_url_4,
      filing.artifact_url_5
    ].filter(Boolean) as string[];

    if (artifacts.length === 0) {
      return <span className="text-muted-foreground">—</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {artifacts.map((url, index) => (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileText className="h-3 w-3" />
            Art{index + 1}
            <ExternalLink className="h-3 w-3" />
          </a>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="border rounded-lg">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading IP filings...</p>
        </div>
      </div>
    );
  }

  if (filings.length === 0) {
    return (
      <div className="border rounded-lg">
        <div className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Filings Found</h3>
          <p className="text-muted-foreground">
            No IP filings match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-semibold">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Family
                </div>
              </th>
              <th className="text-left p-4 font-semibold">Kind</th>
              <th className="text-left p-4 font-semibold">Title</th>
              <th className="text-left p-4 font-semibold">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Filing Date
                </div>
              </th>
              <th className="text-left p-4 font-semibold">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Application #
                </div>
              </th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Artifacts</th>
              <th className="text-left p-4 font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filings.map((filing, index) => (
              <tr key={`${filing.family_code}-${filing.filing_title}-${index}`} className="border-t hover:bg-muted/25">
                <td className="p-4">
                  <div>
                    <div className="font-medium">{filing.family_code}</div>
                    {filing.fam_title && (
                      <div className="text-sm text-muted-foreground">{filing.fam_title}</div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <Badge className={getKindColor(filing.filing_kind)}>
                    {filing.filing_kind}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="font-medium max-w-xs">{filing.filing_title}</div>
                </td>
                <td className="p-4 text-sm">
                  {formatDate(filing.filing_date)}
                </td>
                <td className="p-4">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {filing.application_no || '—'}
                  </code>
                </td>
                <td className="p-4">
                  {filing.status ? (
                    <Badge className={getStatusColor(filing.status)}>
                      {filing.status}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="p-4">
                  {renderArtifactLinks(filing)}
                </td>
                <td className="p-4">
                  <div className="max-w-xs text-sm text-muted-foreground">
                    {filing.notes ? (
                      <span title={filing.notes}>
                        {filing.notes.length > 60 
                          ? `${filing.notes.substring(0, 60)}...` 
                          : filing.notes
                        }
                      </span>
                    ) : (
                      '—'
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}