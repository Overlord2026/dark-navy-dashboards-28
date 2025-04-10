
import React from "react";
import { HomeLoansContent } from "./HomeLoansContent";
import { SecuritiesBasedLoansContent } from "./SecuritiesBasedLoansContent";
import { CommercialLoansContent } from "./CommercialLoansContent";
import { SpecialtyLoansContent } from "./SpecialtyLoansContent";
import { PersonalLoansContent } from "./PersonalLoansContent";

interface CategoryContentProviderProps {
  categoryId: string | null;
}

export const CategoryContentProvider: React.FC<CategoryContentProviderProps> = ({ categoryId }) => {
  switch (categoryId) {
    case "home-loans":
      return <HomeLoansContent />;
    case "securities-loans":
      return <SecuritiesBasedLoansContent />;
    case "commercial-loans":
      return <CommercialLoansContent />;
    case "specialty-loans":
      return <SpecialtyLoansContent />;
    case "personal-loans":
      return <PersonalLoansContent />;
    default:
      return null;
  }
};
