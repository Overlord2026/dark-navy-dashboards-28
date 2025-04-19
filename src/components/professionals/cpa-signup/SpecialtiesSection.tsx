
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface SpecialtiesSectionProps {
  selectedSpecialties: string[];
  onSpecialtyToggle: (specialty: string) => void;
  newSpecialty: string;
  setNewSpecialty: (value: string) => void;
  addCustomSpecialty: () => void;
  defaultSpecialties: string[];
}

export function SpecialtiesSection({
  selectedSpecialties,
  onSpecialtyToggle,
  newSpecialty,
  setNewSpecialty,
  addCustomSpecialty,
  defaultSpecialties,
}: SpecialtiesSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Specialties & Services</h3>
      <div>
        <div className="mb-2">Select your specialties:</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {defaultSpecialties.map((specialty) => (
            <div key={specialty} className="flex items-center space-x-2">
              <Checkbox
                id={`specialty-${specialty}`}
                checked={selectedSpecialties.includes(specialty)}
                onCheckedChange={() => onSpecialtyToggle(specialty)}
              />
              <label
                htmlFor={`specialty-${specialty}`}
                className="text-sm cursor-pointer"
              >
                {specialty}
              </label>
            </div>
          ))}
        </div>

        <div className="flex items-end gap-2 mb-2">
          <div className="flex-1">
            <label htmlFor="custom-specialty" className="text-sm block mb-1">
              Add a custom specialty
            </label>
            <Input
              id="custom-specialty"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              placeholder="E.g., Estate Taxation"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addCustomSpecialty}
            disabled={!newSpecialty}
          >
            Add
          </Button>
        </div>

        {selectedSpecialties.length > 0 && (
          <div className="mt-4">
            <div className="text-sm mb-1">Selected specialties:</div>
            <div className="flex flex-wrap gap-2">
              {selectedSpecialties.map((specialty) => (
                <div
                  key={specialty}
                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center"
                >
                  {specialty}
                  <button
                    type="button"
                    className="ml-1 text-xs"
                    onClick={() => onSpecialtyToggle(specialty)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
