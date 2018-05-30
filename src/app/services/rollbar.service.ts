import * as Rollbar from 'rollbar';
import { InjectionToken } from '@angular/core';

export const RollbarService = new InjectionToken<Rollbar>('rollbar');
