
import Education from "@/pages/Education";
import TaxPlanningEducation from "@/pages/TaxPlanningEducation";
import Courses from "@/pages/education/Courses";
import GuidesWhitepapers from "@/pages/education/GuidesWhitepapers";
import Books from "@/pages/education/Books";
import PlanningExamples from "@/pages/education/PlanningExamples";
import Presentations from "@/pages/education/Presentations";

export const educationRoutes = [
  {
    path: "/education",
    element: <Education />,
  },
  {
    path: "/education/tax-planning",
    element: <TaxPlanningEducation />,
  },
  {
    path: "/courses",
    element: <Courses />,
  },
  {
    path: "/guides",
    element: <GuidesWhitepapers />,
  },
  {
    path: "/books",
    element: <Books />,
  },
  {
    path: "/examples",
    element: <PlanningExamples />,
  },
  {
    path: "/presentations",
    element: <Presentations />,
  }
];
