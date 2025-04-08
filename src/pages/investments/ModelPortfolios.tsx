
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface ManagerCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
}

const ModelPortfolios = () => {
  const navigate = useNavigate();

  // Investment manager categories
  const investmentManagers: ManagerCategory[] = [
    { id: 'bfo-asset-management', name: 'BFO Asset Management', description: 'Explore BFO Asset Management solutions', icon: "text-teal-500", route: "/investments/bfo-asset-management" },
    { id: 'bfo-model-marketplace', name: 'BFO Model Marketplace', description: 'Discover models on the BFO marketplace', icon: "text-emerald-500", route: "/investments/bfo-model-marketplace" },
    { id: 'adelante', name: 'Adelante', description: 'Explore solutions offered by Adelante', icon: "text-blue-500", route: "/investments/adelante" },
    { id: 'alpha-quant', name: 'Alpha Quant', description: 'Quantitative investment strategies by Alpha Quant', icon: "text-purple-500", route: "/investments/alpha-quant" },
    { id: 'ativo', name: 'Ativo', description: 'Investment solutions from Ativo', icon: "text-indigo-500", route: "/investments/ativo" },
    { id: 'avantis', name: 'Avantis', description: 'Avantis investment opportunities', icon: "text-blue-500", route: "/investments/avantis" },
    { id: 'blackrock', name: 'BlackRock', description: 'BlackRock investment strategies and funds', icon: "text-gray-700", route: "/investments/blackrock" },
    { id: 'brown-advisory', name: 'Brown Advisory', description: 'Brown Advisory investment solutions', icon: "text-amber-800", route: "/investments/brown-advisory" },
    { id: 'camelot-portfolios', name: 'Camelot Portfolios', description: 'Strategic investment portfolios by Camelot', icon: "text-blue-600", route: "/investments/camelot-portfolios" },
    { id: 'capital-group', name: 'Capital Group', description: 'Investment solutions from Capital Group', icon: "text-red-600", route: "/investments/capital-group" },
    { id: 'churchill', name: 'Churchill', description: 'Churchill investment strategies', icon: "text-blue-800", route: "/investments/churchill" },
    { id: 'dearborn', name: 'Dearborn', description: 'Dearborn investment opportunities', icon: "text-green-700", route: "/investments/dearborn" },
    { id: 'dundas', name: 'Dundas', description: 'Dundas global investment solutions', icon: "text-blue-500", route: "/investments/dundas" },
    { id: 'easterly', name: 'Easterly Investment Partners', description: 'Investment solutions from Easterly', icon: "text-sky-600", route: "/investments/easterly" },
    { id: 'franklin-templeton', name: 'Franklin Templeton', description: 'Franklin Templeton investment strategies', icon: "text-green-600", route: "/investments/franklin-templeton" },
    { id: 'gwk', name: 'GW&K', description: 'GW&K investment opportunities', icon: "text-blue-700", route: "/investments/gwk" },
    { id: 'goldman-sachs', name: 'Goldman Sachs', description: 'Goldman Sachs investment solutions', icon: "text-blue-900", route: "/investments/goldman-sachs" },
    { id: 'jpmorgan', name: 'JPMorgan', description: 'JPMorgan investment strategies and funds', icon: "text-blue-800", route: "/investments/jpmorgan" },
    { id: 'nuveen', name: 'Nuveen', description: 'Nuveen investment opportunities', icon: "text-teal-700", route: "/investments/nuveen" },
    { id: 'polen', name: 'Polen', description: 'Polen investment solutions', icon: "text-indigo-600", route: "/investments/polen" },
    { id: 'saratoga', name: 'Saratoga', description: 'Saratoga investment strategies', icon: "text-red-700", route: "/investments/saratoga" },
    { id: 'sawgrass', name: 'Sawgrass', description: 'Sawgrass investment opportunities', icon: "text-green-800", route: "/investments/sawgrass" },
    { id: 'schafer-cullen', name: 'Schafer Cullen', description: 'Schafer Cullen investment solutions', icon: "text-purple-700", route: "/investments/schafer-cullen" },
    { id: 'state-street', name: 'State Street', description: 'State Street investment strategies', icon: "text-blue-600", route: "/investments/state-street" },
    { id: 'suncoast', name: 'Suncoast', description: 'Suncoast investment opportunities', icon: "text-yellow-600", route: "/investments/suncoast" },
    { id: 'trowe-price', name: 'T. Rowe Price', description: 'T. Rowe Price investment solutions', icon: "text-blue-700", route: "/investments/trowe-price" },
    { id: 'victory-capital', name: 'Victory Capital', description: 'Victory Capital investment strategies', icon: "text-red-600", route: "/investments/victory-capital" },
    { id: 'washington-crossing', name: 'Washington Crossing', description: 'Washington Crossing investment opportunities', icon: "text-indigo-700", route: "/investments/washington-crossing" },
    { id: 'zacks', name: 'Zacks', description: 'Zacks investment solutions', icon: "text-green-600", route: "/investments/zacks" },
    { id: 'custom-portfolios', name: 'Custom Portfolios', description: 'Personalized investment portfolios', icon: "text-purple-600", route: "/investments/custom-portfolios" },
    { id: 'shared-by-advisor', name: 'Shared by your advisor', description: 'View portfolios shared by your advisor', icon: "text-blue-500", route: "/investments/shared-by-advisor" },
    { id: 'custom', name: 'Custom', description: 'Create your own custom investment strategy', icon: "text-gray-600", route: "/investments/custom" }
  ];

  const handleAssetClick = (path: string) => {
    navigate(path);
  };

  const handleDownloadFactSheet = (managerName: string) => {
    toast.success(`Downloading fact sheet for ${managerName}`, {
      description: "Your download will begin shortly."
    });
    // In a real app this would trigger an actual download
  };

  // Chunk the managers for responsive grid display
  const chunkArray = <T,>(array: T[], size: number): T[][] => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  };
  
  const chunkedManagers = chunkArray(investmentManagers, 3);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Model Portfolios</h1>
        <Button onClick={() => navigate('/investments/models/all')}>View All Portfolios</Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Strategic Investment Portfolios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Explore professionally designed model portfolios tailored to different risk profiles and investment objectives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button onClick={() => navigate('/investments/models/all')} className="flex-1">
                Browse Portfolios
              </Button>
              <Button variant="outline" onClick={() => navigate('/investments/builder')} className="flex-1">
                Create Custom Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investment Managers & Solutions</CardTitle>
            <CardDescription>Browse available investment managers and their model portfolios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {chunkedManagers.map((chunk, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chunk.map((manager) => (
                  <div 
                    key={manager.id}
                    onClick={() => handleAssetClick(manager.route)} 
                    className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-4 block cursor-pointer"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={manager.icon}>
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                          <path d="M12 3V21" stroke="currentColor" strokeWidth="2" />
                          <path d="M3 12H21" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">{manager.name}</h4>
                        <p className="text-muted-foreground text-sm mt-1">{manager.description}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <Button
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-800 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadFactSheet(manager.name);
                          }}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Fact Sheet
                        </Button>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModelPortfolios;
