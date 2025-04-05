
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GuideCard } from "./GuideCard";
import { AddGuideForm } from "./AddGuideForm";
import { useGuides } from "@/hooks/useGuides";

export function GuidesList() {
  const {
    guides,
    showAddForm,
    addGuide,
    deleteGuide,
    moveGuideUp,
    moveGuideDown,
    toggleAddForm
  } = useGuides();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Financial Guides by Tony Gomes</h3>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={toggleAddForm}
        >
          <Plus className="h-4 w-4" />
          {showAddForm ? "Cancel" : "Add New Guide"}
        </Button>
      </div>

      {showAddForm && (
        <AddGuideForm 
          onAddGuide={addGuide} 
          onCancel={() => toggleAddForm()} 
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {guides.map((guide, index) => (
          <GuideCard
            key={guide.id}
            guide={guide}
            index={index}
            onDelete={deleteGuide}
            onMoveUp={moveGuideUp}
            onMoveDown={moveGuideDown}
            isFirst={index === 0}
            isLast={index === guides.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
