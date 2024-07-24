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
  selector: '[colCount]',
  standalone: true,
})
export class ColCountDirective implements OnInit {
  @Input() colCount!: number;
  platformId = inject(PLATFORM_ID);
  constructor(private el: ElementRef, private render2: Renderer2) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const nativeElement = this.el.nativeElement;
      const mediaQL = matchMedia('(max-width: 767px)');

      this.render2.setStyle(nativeElement, 'display', 'grid');
      this.render2.setStyle(nativeElement, 'row-gap', '12px');
      this.render2.setStyle(nativeElement, 'column-gap', '12px');

      this.resizeChange(mediaQL, nativeElement);
      //listen resize
      this.render2.listen(window, 'resize', () =>
        this.resizeChange(mediaQL, nativeElement)
      );
    }
  }

  resizeChange(mql: MediaQueryList, nativeElement: any) {
    if (mql.matches) {
      this.render2.setStyle(
        nativeElement,
        'grid-template-columns',
        `repeat(1, 1fr)`
      );
    } else {
      this.render2.setStyle(
        nativeElement,
        'grid-template-columns',
        `repeat(${this.colCount}, 1fr)`
      );
    }
  }
}
