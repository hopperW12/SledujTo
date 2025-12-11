import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeenPage } from './seen.page';

describe('SeenPage', () => {
  let component: SeenPage;
  let fixture: ComponentFixture<SeenPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeenPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SeenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
