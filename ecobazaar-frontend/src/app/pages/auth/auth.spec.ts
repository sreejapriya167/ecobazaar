import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthComponent } from './auth'; // ✅ Update import
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthComponent], // ✅ Import the standalone component
      providers: [
        {
          // ✅ Mock ActivatedRoute so the constructor doesn't crash
          provide: ActivatedRoute,
          useValue: {
            data: of({ isSignUp: false }) // Simulate visiting '/login'
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to Login mode', () => {
    expect(component.isSignUpMode).toBeFalse();
  });
});