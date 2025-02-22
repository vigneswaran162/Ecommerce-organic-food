import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipperComponent } from './swipper.component';

describe('SwipperComponent', () => {
  let component: SwipperComponent;
  let fixture: ComponentFixture<SwipperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwipperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwipperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
