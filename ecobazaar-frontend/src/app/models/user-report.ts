export interface UserReport {
  totalPurchase: number;
  totalSpent: number;
  totalCarbonUsed: number;
  totalCarbonSaved: number;
  ecoBadge: string;
  // Arrays for the charts
  monthlySaved: number[]; 
  monthlyUsed: number[];
  months: string[];
}