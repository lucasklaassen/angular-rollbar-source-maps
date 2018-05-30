import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

import { AppComponent } from './app.component';
import { RollbarErrorHandler } from './errorHandlers/rollbar.errorHandler';
import { RollbarFactory } from './factories/rollbar.factory';
import { RollbarService } from './services/rollbar.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
    { provide: RollbarService, useFactory: RollbarFactory },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
