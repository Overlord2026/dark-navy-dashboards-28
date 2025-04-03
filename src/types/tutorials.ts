
import { ReactNode } from "react";

export interface Resource {
  name: string;
  url: string;
}

export interface TabTutorial {
  tabId: string;
  title: string;
  description?: string;
  videoUrl?: string;
  content?: ReactNode;
  resources?: Resource[];
}
