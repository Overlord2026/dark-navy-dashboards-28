
import { Button } from "@/components/ui/button";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";

interface AdvisorInfo {
  name: string;
  title?: string;
  location?: string;
  email?: string;
  phone?: string;
  office?: string;
  bio?: string;
}

interface BookSessionDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  advisorInfo: AdvisorInfo;
}

export const BookSessionDrawer = ({ isOpen, onOpenChange, advisorInfo }: BookSessionDrawerProps) => {
  const handleContinue = () => {
    // Open the new Calendly link in a new tab
    window.open("https://calendly.com/tonygomes/60min", "_blank");
    onOpenChange(false);
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white">
        <div className="mx-auto w-full max-w-4xl p-6">
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-xl font-bold">Book a Meeting with {advisorInfo.name}</DrawerTitle>
            <DrawerDescription>
              Choose a time that works for you
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="flex flex-col md:flex-row gap-6 my-6">
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
                <p className="text-sm text-gray-500 mb-4">Showing available time slots</p>
                
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
            <Button onClick={handleContinue}>Continue to Calendly</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
