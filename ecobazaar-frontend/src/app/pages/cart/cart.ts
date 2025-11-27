import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, DecimalPipe],   // ← add DecimalPipe here
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {

  cartSummary: any;
  isLoading = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.isLoading = true;
    this.cartService.getCartSummary().subscribe({
      next: summary => {
        this.cartSummary = summary;
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

remove(line: any) {
  // Use the exact field name from JSON: check Network → Response for cart GET
  const id = line.cartItemId || line.id;

  this.cartService.removeFromCart(id).subscribe({
    next: () => this.loadCart(),   // reload cart after delete
    error: err => {
      console.error('Remove failed', err);
      alert('Failed to remove item from cart');
    }
  });
}


  checkout() {
  if (!this.cartSummary || !this.cartSummary.items || this.cartSummary.items.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  const total = this.cartSummary.totalPrice.toFixed(2);
  const carbon = this.cartSummary.totalCarbonUsed.toFixed(2);

  if (!confirm(`Confirm checkout?\n\nTotal: ₹${total}\nCarbon used: ${carbon} kg`)) {
    return;
  }

  this.cartService.checkout().subscribe({
    next: () => {
      alert('Thank you! Your eco-friendly order has been placed.');
      this.loadCart(); // reload to show empty cart
    },
    error: err => {
      console.error(err);
      alert('Checkout failed. Please try again.');
    }
  });
}

}
