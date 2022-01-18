import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRootComponent } from './baseRoute/auth-root/auth-root.component';
import { RootComponent } from './baseRoute/root/root.component';
import { ForgotPasswordComponent } from './rootComponent/forgot-password/forgot-password.component';
import { LoginComponent } from './rootComponent/login/login.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    // canActivate: [BaseGuard],
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'password',
        component: ForgotPasswordComponent,
      },
    ]
  },
  {
    path: '_',
    component: AuthRootComponent,
    children:
      [
        {
          path: '',
          redirectTo: 'dashboard',
          pathMatch: 'full',
        },
        {
          path: 'dashboard',
          component: DashboardComponent
          // canActivate: [AuthGuard]
        },
        {
          path: 'events',
          loadChildren: () => import('./modules/events/events.module').then(m => m.EventsModule),
          // canActivate: [AuthGuard]
        },
        {
          path: 'blogs',
          loadChildren: () => import('./modules/blogs/blogs.module').then(m => m.BlogsModule),
          // canActivate: [AuthGuard]
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
