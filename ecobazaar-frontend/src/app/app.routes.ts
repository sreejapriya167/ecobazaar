import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AuthComponent } from './pages/auth/auth'; // ✅ The merged component
import { Admin } from './pages/admin/admin';
import { CartComponent } from './pages/cart/cart';
import { ProductList } from './pages/product-list/product-list'; 
import { AuthGuard } from './guards/auth.guard';
import { Dashboard } from './pages/dashboard/dashboard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: Home },
  
  // ✅ Both paths now point to the same AuthComponent
  // We pass 'isSignUp' data so the component knows which side to show
  { 
    path: 'login', 
    component: AuthComponent, 
    data: { isSignUp: false } 
  },
  { 
    path: 'register', 
    component: AuthComponent, 
    data: { isSignUp: true } 
  },

  { path: 'cart', component: CartComponent },
  { path: 'products', component: ProductList },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },

  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then(m => m.Admin),
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },

  { path: '**', redirectTo: '' }
];