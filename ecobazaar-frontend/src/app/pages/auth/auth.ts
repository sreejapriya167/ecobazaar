import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Adjust path if needed
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss']
})
export class AuthComponent {
  // This variable controls the slide
  isSignUpMode = false;

  constructor(private authService: AuthService, private router: Router) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  // Toggle the slider
  toggleMode() {
    this.isSignUpMode = !this.isSignUpMode;
  }
  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          // Navigation happens in Service, or you can do it here:
          // this.router.navigate(['/']);
        },
        error: (err) => {
          alert("Login Failed! Check email or password.");
          console.error(err);
        }
      });
    }
  }
onRegister() {
  console.log("🖱️ Register Button Clicked!");
  console.log("📝 Form Data:", this.registerForm.value);
  console.log("✅ Is Form Valid?", this.registerForm.valid);

  if (this.registerForm.valid) {
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log("🎉 Registration Success:", response);
        alert("Account Created! Please Sign In.");
        this.toggleMode(); // Switch to Login view
      },
      error: (err) => {
        console.error("🔥 Registration Failed:", err);
        alert("Registration Failed: " + (err.error || err.message));
      }
    });
  } else {
    console.error("❌ Form is Invalid! Check inputs.");
    // This shows you which specific field is broken
    Object.keys(this.registerForm.controls).forEach(key => {
        if (this.registerForm.get(key)?.invalid) {
            console.log('❌ Invalid Field:', key);
        }
    });
  }
}
}