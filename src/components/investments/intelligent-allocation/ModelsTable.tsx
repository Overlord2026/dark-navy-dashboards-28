
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScheduleMeetingDialog } from "@/components/common/ScheduleMeetingDialog";
import { IAModel } from "./types";
import { formatDate } from "./utils";

interface ModelsTableProps {
  models: IAModel[];
  onInterested: (modelId: string) => void;
}

const ModelsTable: React.FC<ModelsTableProps> = ({ models, onInterested }) => {
  return (
    <div className="rounded-md border border-gray-800 overflow-auto">
      <Table className="min-w-full">
        <TableHeader className="bg-[#0f172a]">
          <TableRow>
            <TableHead className="text-white whitespace-nowrap w-1/4">Name</TableHead>
            <TableHead className="text-white whitespace-nowrap">Type</TableHead>
            <TableHead className="text-white whitespace-nowrap">Targets</TableHead>
            <TableHead className="text-white whitespace-nowrap">Updated</TableHead>
            <TableHead className="text-white whitespace-nowrap">Benchmark</TableHead>
            <TableHead className="text-white whitespace-nowrap">Tags</TableHead>
            <TableHead className="text-white whitespace-nowrap text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.id} className="hover:bg-[#0f172a]/50 border-t border-gray-800">
              <TableCell className="font-medium text-white">{model.name}</TableCell>
              <TableCell className="text-gray-300">{model.type}</TableCell>
              <TableCell className="text-gray-300">{model.targets}</TableCell>
              <TableCell className="text-gray-300">
                <div className="flex flex-col">
                  <span>{formatDate(model.updated)}</span>
                  <span className="text-xs text-gray-400">Created: {formatDate(model.created)}</span>
                </div>
              </TableCell>
              <TableCell className="text-gray-300">{model.benchmark}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {model.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="border-gray-600 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="interested" 
                    size="sm" 
                    className="bg-yellow-600 hover:bg-yellow-700 text-black font-medium"
                    onClick={() => onInterested(model.id)}
                  >
                    I'm Interested
                  </Button>
                  <ScheduleMeetingDialog 
                    assetName={model.name} 
                    variant="outline" 
                    className="text-xs py-1 h-auto border-gray-600 hover:bg-[#0f172a]" 
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ModelsTable;
