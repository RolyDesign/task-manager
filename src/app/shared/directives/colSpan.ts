import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  inject,
  Input,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[colSpan]',
  standalone: true,
})
export class ColSpanDirective implements OnInit {
  @Input() colSpan!: number;
  platformId = inject(PLATFORM_ID);
  constructor(private el: ElementRef, private render2: Renderer2) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const nativeElement = this.el.nativeElement;
      const mediaQL = matchMedia('(max-width: 767px)');

      this.resizeChange(mediaQL, nativeElement);

      this.render2.listen(window, 'resize', () =>
        this.resizeChange(mediaQL, nativeElement)
      );
    }
  }
  resizeChange(mql: MediaQueryList, nativeElement: any) {
    if (mql.matches) {
      this.render2.setStyle(nativeElement, 'grid-column', `span 1`);
    } else {
      this.render2.setStyle(
        nativeElement,
        'grid-column',
        `span ${this.colSpan}`
      );
    }
  }
}
