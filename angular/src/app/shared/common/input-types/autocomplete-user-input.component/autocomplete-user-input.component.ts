import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GetUsersInput, UserSearchDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { PermissionCheckerService } from 'abp-ng2-module';

@Component({
  selector: 'autocomplete-user-input',
  styleUrls: ['./autocomplete-user-input.component.less'],
  templateUrl: './autocomplete-user-input.component.html'
})
export class AutocompleteUserInputComponent {
  @Input() label: string;
  @Input() isEditMode: boolean;
  @Input() userRole: string;
  @Input() user: UserSearchDto;
  @Output() userChange = new EventEmitter<UserSearchDto>();

  filteredUsers: UserSearchDto[];

  constructor(
    private _userServiceProxy: UserServiceProxy,
    private _permission: PermissionCheckerService
  ) { }

  filterUsers(event): void {
    if (this.userRole && this._permission.isGranted('Pages.Users.' + this.userRole + 's')) {
        let input = new GetUsersInput();
        input.filter = event.query;
        input.roleName = this.userRole;

        this._userServiceProxy.searchUser(input).subscribe(users => {
            this.filteredUsers = users;
        });
    }
  }

  clear() {
    this.user = undefined;
    this.userChange.emit(this.user);
  }

  onSelect() {
    this.userChange.emit(this.user);
  }
}

