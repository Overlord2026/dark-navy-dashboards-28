
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";

interface BookingDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  advisorName: string;
}

export const BookingDrawer: React.FC<BookingDrawerProps> = ({
  isOpen,
  onOpenChange,
  advisorName
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white">
        <div className="mx-auto w-full max-w-4xl p-6">
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-xl font-bold">Book a Meeting with {advisorName}</DrawerTitle>
            <DrawerDescription>
              Choose a time that works for you
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="flex flex-col md:flex-row gap-6 my-6">
            <div className="flex-1 p-6 bg-[#0a1021] text-white rounded-lg">
              <div className="text-center mb-6">
                <div className="mx-auto w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img
                    src="/lovable-uploads/b4df25d6-12d7-4c34-874e-804e72335904.png"
                    alt={advisorName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium">Meet with {advisorName}</h3>
                <div className="flex items-center justify-center mt-2 text-gray-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>March 2023</span>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center mb-4">
                <div className="text-xs text-gray-400">SUN</div>
                <div className="text-xs text-gray-400">MON</div>
                <div className="text-xs text-gray-400">TUE</div>
                <div className="text-xs text-gray-400">WED</div>
                <div className="text-xs text-gray-400">THU</div>
                <div className="text-xs text-gray-400">FRI</div>
                <div className="text-xs text-gray-400">SAT</div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <div 
                    key={day}
                    className={`
                      aspect-square flex items-center justify-center rounded-full text-sm
                      ${day === 15 ? 'bg-white text-[#0a1021] font-medium' : 'hover:bg-white/10 cursor-pointer'}
                    `}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="mb-6">
                <h4 className="font-medium mb-2">How long do you need?</h4>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-gray-100">30 mins</Button>
                  <Button variant="outline" className="flex-1">15 mins</Button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">What time works best?</h4>
                <p className="text-sm text-gray-500 mb-4">Showing times for March 15, 2023</p>
                
                <div className="space-y-2">
                  {["10:15 am", "1:15 pm", "3:15 pm", "4:45 pm", "5:30 pm"].map((time) => (
                    <Button 
                      key={time}
                      variant="outline" 
                      className="w-full justify-center text-center"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <DrawerFooter>
            <Button onClick={() => window.open("https://calendly.com/tonygomes/60min", "_blank")}>Continue</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
