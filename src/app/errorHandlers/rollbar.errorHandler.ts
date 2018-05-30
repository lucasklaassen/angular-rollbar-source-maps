import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { RollbarService } from '../services/rollbar.service';
import { environment } from '../../environments/environment';

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(err: any): void {
    const rollbar = this.injector.get(RollbarService);
    rollbar.error(err.originalError || err);
    if (environment.environment !== 'production') { throw err; }
  }
}
