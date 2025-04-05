
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GuideCard } from "./GuideCard";
import { AddGuideForm } from "./AddGuideForm";
import { useGuides } from "@/hooks/useGuides";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Financial Guides by Tony Gomes</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Expert guides to help with your financial planning
          </p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-blue-300 dark:border-blue-700"
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

      {guides.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {guides.map((guide, index) => (
            <motion.div key={guide.id} variants={itemVariants}>
              <GuideCard
                guide={guide}
                index={index}
                onDelete={deleteGuide}
                onMoveUp={moveGuideUp}
                onMoveDown={moveGuideDown}
                isFirst={index === 0}
                isLast={index === guides.length - 1}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : !showAddForm && (
        <Card className="p-8 text-center border-dashed border-2 bg-muted/20">
          <h4 className="font-medium text-lg mb-2">No Guides Available</h4>
          <p className="text-muted-foreground mb-4">Add your first guide to get started.</p>
          <Button 
            onClick={toggleAddForm}
            variant="outline" 
            className="inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Guide
          </Button>
        </Card>
      )}
    </div>
  );
}
