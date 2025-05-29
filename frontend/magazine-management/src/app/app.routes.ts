import { Routes } from '@angular/router';
import { MagazineFormComponent } from './components/magazine-form/magazine-form.component';
import { MagazineComponent } from './components/magazine/magazine.component';
import { MagazineDetailsComponent } from './components/magazine-details/magazine-details.component';
import { ArticleDetailsComponent } from './components/article-details/article-details.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard as AuthGuard } from "./guards/auth.guard";
import { roleGuard as RoleGuard } from "./guards/role.guard";
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'magazines', component: MagazineComponent },
	{ path: 'magazines/:id', component: MagazineDetailsComponent },
	{
		path: 'magazine-form',
		component: MagazineFormComponent,
		canActivate: [AuthGuard, RoleGuard],
		data: { roles: ['Admin', 'Writer'] }
	},
	{
		path: 'magazine-form/:id',
		component: MagazineFormComponent,
		canActivate: [AuthGuard, RoleGuard],
		data: { roles: ['Admin', 'Writer'] }
	},
	{ path: 'articles/:id', component: ArticleDetailsComponent },
	{
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [AuthGuard, RoleGuard],
		data: { roles: ['Admin'] }
	},
	{
		path: 'profile',
		component: ProfileComponent,
		canActivate: [AuthGuard],
	},

];
