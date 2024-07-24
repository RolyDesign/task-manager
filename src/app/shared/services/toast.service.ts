import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {}
  toastrService = inject(ToastrService);

  errorNotify(message: string, displayTime: number = 3000) {
    this.toastrService.error(message, undefined, {
      timeOut: displayTime,
    });
  }

  successNotify(message: string, displayTime: number = 3000) {
    this.toastrService.success(message, undefined, {
      timeOut: displayTime,
    });
  }
}
