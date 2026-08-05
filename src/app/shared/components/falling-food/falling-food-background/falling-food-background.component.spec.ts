import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FallingFoodBackgroundComponent } from './falling-food-background.component';

describe('FallingFoodBackgroundComponent', () => {
  let component: FallingFoodBackgroundComponent;
  let fixture: ComponentFixture<FallingFoodBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FallingFoodBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FallingFoodBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
