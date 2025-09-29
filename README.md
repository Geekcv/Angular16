// rbacConfig.js
module.exports = {
  roles: {
    1: ["cr_sh", "fe_all_sch", "fe_all_cls_of_school"],  // SuperAdmin
    2: ["fe_all_sch", "fe_all_cls_of_school"],           // Admin
    3: ["fe_sc_class", "fe_sb", "fe_chap"],              // Teacher/Manager
    4: ["fe_chap"],                                      // Student
  },
  errorResponse: {
    msg: "You are not authorized to perform this action",
    status: 403,
  },
};


router.post("/", verifyToken, function (req, res, next) {
  let data = JSON.parse(decodeURIComponent(atob(req.body.payload)));
  data["user_id"] = req.token.data.row_id;

  let fn = "common_fn";
  let se = data.se;

  // Special service to fetch role & permissions
  if (se === "get_role_permission") {
    const tokenData = req.token.data;
    const userRole = tokenData.user_type;

    const roleNames = {
      1: "super_admin",
      2: "admin",
      3: "teacher",
      4: "student"
    };

    const response = {
      status: 0,
      msg: "User info fetched successfully",
      data: {
        role: roleNames[userRole] || "unknown",
        permissions: rbacConfig.roles[userRole] || [],
      },
    };

    return res.send(encodeReqData(response));
  }

  // RBAC check for other services
  const userRole = req.token.data.user_type;
  const allowedPermissions = rbacConfig.roles[userRole] || [];
  if (!allowedPermissions.includes(se)) {
    return res.status(403).send(encodeReqData(rbacConfig.errorResponse));
  }


  login(email, password) {
  this.http.post('/api/auth/login', { email, password }).subscribe((res: any) => {
    localStorage.setItem('authToken', res.token); // store token only
    this.loadUserPermissions(); // immediately fetch role & permissions
  });
}


loadUserPermissions() {
  const token = localStorage.getItem("authToken");
  this.http.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
    .subscribe((res: any) => {
      this.permissionService.setPermissions(res.role, res.permissions);
    });
}
@Injectable({ providedIn: 'root' })
export class PermissionService {
  private role: string | null = null;
  private permissions: string[] = [];

  setPermissions(role: string, permissions: string[]) {
    this.role = role;
    this.permissions = permissions;
  }

  hasPermission(permission: string) {
    return this.permissions.includes(permission);
  }

  isRole(roleName: string) {
    return this.role === roleName;
  }
}


<!-- Show button only if user has permission -->
<button *ngIf="permissionService.hasPermission('cr_sh')">
  Create School
</button>

<!-- Show div only for super admin -->
<div *ngIf="permissionService.isRole('super_admin')">
  Super Admin Dashboard
</div>



@Injectable({ providedIn: 'root' })
export class PermissionService {
  private role: string | null = null;
  private permissions: string[] = [];

  setPermissions(role: string, permissions: string[]) {
    this.role = role;
    this.permissions = permissions;
  }

  hasPermission(permission: string) {
    return this.permissions.includes(permission);
  }

  isRole(roleName: string) {
    return this.role === roleName;
  }

  getRole() {
    return this.role;
  }
}



/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { PermissionService } from 'app/services/permission.service'; // inject if needed

export const defaultNavigation = (role: string): FuseNavigationItem[] => {
  const navigation: FuseNavigationItem[] = [];

  // Example: show different menus based on role
  if (role === 'super_admin') {
    navigation.push(
      { id: 'dashboard', title: 'Dashboard', type: 'basic', icon: 'mat_solid:dashboard', link: '/dashboard' },
      { id: 'selfrating', title: 'Self Rating', type: 'basic', icon: 'star_rate', link: '/selfrating' },
      { id: 'audionotes', title: 'Audio Notes', type: 'basic', icon: 'mat_outline:audiotrack', link: '/audionotes' },
      { id: 'settings', title: 'Settings', type: 'basic', icon: 'feather:settings', link: 'settings' },
    );
  } else if (role === 'admin') {
    navigation.push(
      { id: 'dashboard', title: 'Dashboard', type: 'basic', icon: 'mat_solid:dashboard', link: '/dashboard' },
      { id: 'audionotes', title: 'Audio Notes', type: 'basic', icon: 'mat_outline:audiotrack', link: '/audionotes' },
    );
  } else if (role === 'teacher') {
    navigation.push(
      { id: 'dashboard', title: 'Dashboard', type: 'basic', icon: 'mat_solid:dashboard', link: '/dashboard' },
      { id: 'selfrating', title: 'Self Rating', type: 'basic', icon: 'star_rate', link: '/selfrating' },
    );
  } else if (role === 'student') {
    navigation.push(
      { id: 'dashboard', title: 'Dashboard', type: 'basic', icon: 'mat_solid:dashboard', link: '/dashboard' },
    );
  }

  return navigation;
};



@Injectable({ providedIn: 'root' })
export class NavigationMockApi {
  constructor(
    private _fuseMockApiService: FuseMockApiService,
    private permissionService: PermissionService // inject service
  ) {
    this.registerHandlers();
  }

  registerHandlers(): void {
    this._fuseMockApiService.onGet('api/common/navigation').reply(() => {
      const role = this.permissionService.getRole(); // get role from in-memory service
      const navigation = defaultNavigation(role || 'student'); // fallback
      return [200, { default: navigation }];
    });
  }
}


  eval(fn + "." + se)(data, res);
});
