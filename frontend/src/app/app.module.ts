import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { EmailsComponent } from './components/emails/emails.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SummEmailComponent } from './components/summ-email/summ-email.component';
import { AttributesComponent } from './components/attributes/attributes.component';
import { ResponseComponent } from './components/response/response.component';
import { RouterModule, Routes} from '@angular/router';

import { MatToolbarModule } from '@angular/material';
import {MatTableModule} from '@angular/material/table';

const routes: Routes = [
  { path: 'navbar', component: NavbarComponent},
  { path: 'summ-email', component: SummEmailComponent},
  { path: 'emails', component: EmailsComponent},
  { path: 'attributes', component: AttributesComponent},
  { path: 'response', component: ResponseComponent},
  { path: '', redirectTo: 'emails', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    EmailsComponent,
    NavbarComponent,
    SummEmailComponent,
    AttributesComponent,
    ResponseComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    MatToolbarModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
