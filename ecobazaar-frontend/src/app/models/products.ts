export interface Product {
  id: number;
  name: string;
  price: number;
  details: string;       // Matches Java 'details'
  category: string;
  carbonImpact: number;  // Matches Java 'carbonImpact'
  ecoCertified: boolean; // Ensure your Java model sends this boolean
  imageUrl: string;
  ecoRequested?: boolean; 
}