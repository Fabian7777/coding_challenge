import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService, DEFAULT_TIMEOUT } from './services/auth.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    [{ provide: HTTP_INTERCEPTORS, useClass: AuthService, multi: true }],
    [{ provide: DEFAULT_TIMEOUT, useValue: 200000 }]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
