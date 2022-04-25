import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateUserInput, GetListingInput, ListingResposeDto, ListingServiceProxy, PasswordComplexitySetting, ProfileServiceProxy, UserEditDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { LazyLoadEvent, Paginator, Table } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { filter, finalize, map, tap } from 'rxjs/operators';
import { CheckListItem } from '../shared/general-combo-string.component';

@Component({
    templateUrl: './manage-customers.component.html',
    styleUrls: ['./manage-customers.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()]
})
export class ManageCustomersComponent extends AppComponentBase implements OnInit {
    userId: string;
    subjectUserId = new Subject<string>();
    active = false;
    saving = false;
    canChangeUserName = true;
    cities = { 'items': { 'A': { 'Adak': [], 'Akiachak': [], 'Akiak': [], 'Akutan': [], 'Alakanuk': [], 'Aleknagik': [], 'Allakaket': [], 'Ambler': [], 'Anaktuvuk Pass': [], 'Anchor Point': [], 'Anchorage': [], 'Anderson': [], 'Angoon': [], 'Aniak': [], 'Anvik': [], 'Arctic Village': [], 'Atka': [], 'Atqasuk': [], 'Auke Bay': [] }, 'B': { 'Barrow': [], 'Beaver': [], 'Bethel': [], 'Bettles Field': [], 'Big Lake': [], 'Brevig Mission': [], 'Buckland': [] }, 'C': { 'Cantwell': [], 'Central': [], 'Chalkyitsik': [], 'Chefornak': [], 'Chevak': [], 'Chicken': [], 'Chignik': [], 'Chignik Lagoon': [], 'Chignik Lake': [], 'Chitina': [], 'Chugiak': [], 'Circle': [], 'Clam Gulch': [], 'Clarks Point': [], 'Clear': [], 'Coffman Cove': [], 'Cold Bay': [], 'Cooper Landing': [], 'Copper Center': [], 'Cordova': [], 'Craig': [], 'Crooked Creek': [] }, 'D': { 'Deering': [], 'Delta Junction': [], 'Denali National Park': [], 'Dillingham': [], 'Douglas': [], 'Dutch Harbor': [] }, 'E': { 'Eagle': [], 'Eagle River': [], 'Eek': [], 'Egegik': [], 'Eielson Afb': [], 'Ekwok': [], 'Elfin Cove': [], 'Elim': [], 'Elmendorf Afb': [], 'Emmonak': [], 'Ester': [] }, 'F': { 'Fairbanks': [], 'False Pass': [], 'Flat': [], 'Fort Richardson': [], 'Fort Wainwright': [], 'Fort Yukon': [] }, 'G': { 'Gakona': [], 'Galena': [], 'Gambell': [], 'Girdwood': [], 'Glennallen': [], 'Goodnews Bay': [], 'Grayling': [], 'Gustavus': [] }, 'H': { 'Haines': [], 'Healy': [], 'Holy Cross': [], 'Homer': [], 'Hoonah': [], 'Hooper Bay': [], 'Hope': [], 'Houston': [], 'Hughes': [], 'Huslia': [], 'Hydaburg': [], 'Hyder': [] }, 'I': { 'Iliamna': [], 'Indian': [] }, 'J': { 'Juneau': [] }, 'K': { 'Kake': [], 'Kaktovik': [], 'Kalskag': [], 'Kaltag': [], 'Karluk': [], 'Kasigluk': [], 'Kasilof': [], 'Kenai': [], 'Ketchikan': [], 'Kiana': [], 'King Cove': [], 'King Salmon': [], 'Kipnuk': [], 'Kivalina': [], 'Klawock': [], 'Kobuk': [], 'Kodiak': [], 'Kotlik': [], 'Kotzebue': [], 'Koyuk': [], 'Koyukuk': [], 'Kwethluk': [], 'Kwigillingok': [] }, 'L': { 'Lake Minchumina': [], 'Larsen Bay': [], 'Levelock': [], 'Lower Kalskag': [] }, 'M': { 'Manley Hot Springs': [], 'Manokotak': [], 'Marshall': [], 'Mc Grath': [], 'Mekoryuk': [], 'Metlakatla': [], 'Meyers Chuck': [], 'Minto': [], 'Moose Pass': [], 'Mountain Village': [] }, 'N': { 'Naknek': [], 'Napakiak': [], 'Nenana': [], 'New Stuyahok': [], 'Nightmute': [], 'Nikiski': [], 'Nikolai': [], 'Nikolski': [], 'Ninilchik': [], 'Noatak': [], 'Nome': [], 'Nondalton': [], 'Noorvik': [], 'North Pole': [], 'Northway': [], 'Nuiqsut': [], 'Nulato': [], 'Nunam Iqua': [], 'Nunapitchuk': [] }, 'O': { 'Old Harbor': [], 'Ouzinkie': [] }, 'P': { 'Palmer': [], 'Pedro Bay': [], 'Pelican': [], 'Perryville': [], 'Petersburg': [], 'Pilot Point': [], 'Pilot Station': [], 'Platinum': [], 'Point Baker': [], 'Point Hope': [], 'Point Lay': [], 'Port Alexander': [], 'Port Alsworth': [], 'Port Heiden': [], 'Port Lions': [], 'Prudhoe Bay': [] }, 'Q': { 'Quinhagak': [] }, 'R': { 'Rampart': [], 'Red Devil': [], 'Ruby': [], 'Russian Mission': [] }, 'S': { 'Saint George Island': [], 'Saint Marys': [], 'Saint Michael': [], 'Saint Paul Island': [], 'Salcha': [], 'Sand Point': [], 'Savoonga': [], 'Scammon Bay': [], 'Selawik': [], 'Seldovia': [], 'Seward': [], 'Shageluk': [], 'Shaktoolik': [], 'Shishmaref': [], 'Shungnak': [], 'Sitka': [], 'Skagway': [], 'Skwentna': [], 'Sleetmute': [], 'Soldotna': [], 'South Naknek': [], 'Stebbins': [], 'Sterling': [], 'Stevens Village': [], 'Sutton': [] }, 'T': { 'Takotna': [], 'Talkeetna': [], 'Tanacross': [], 'Tanana': [], 'Tatitlek': [], 'Teller': [], 'Tenakee Springs': [], 'Tetlin': [], 'Thorne Bay': [], 'Togiak': [], 'Tok': [], 'Toksook Bay': [], 'Trapper Creek': [], 'Tuluksak': [], 'Tuntutuliak': [], 'Tununak': [], 'Two Rivers': [], 'Tyonek': [] }, 'U': { 'Unalakleet': [], 'Unalaska': [] }, 'V': { 'Valdez': [], 'Venetie': [] }, 'W': { 'Wainwright': [], 'Wales': [], 'Ward Cove': [], 'Wasilla': [], 'White Mountain': [], 'Whittier': [], 'Willow': [], 'Wrangell': [] }, 'Y': { 'Yakutat': [] } }, 'api_version': '1.22.0', 'api_code': 200, 'account_updated_at': '2020-11-29 22:06:12', 'user_updated_at': '2020-12-03 03:11:37', 'announcement': null, 'has_whatsnew': false }

    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();


    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    user: UserEditDto = new UserEditDto();
    sendActivationEmail = true;
    setRandomPassword = true;
    passwordComplexityInfo = '';
    profilePicture: string;
    listenings: ListingResposeDto;
    advancedFiltersAreShown: boolean;
    input: GetListingInput = new GetListingInput();
    userPasswordRepeat = '';
    citiesShown: boolean;
    cityCtrl = new FormControl();
    filteredCities: Observable<string[]>;
    selectedCities: string[] = [];
    citiesStrings: string[];
    separatorKeysCodes: number[] = [ENTER, COMMA];
    @ViewChild('citiesFilterInput') fruitInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    citiefFilters: CheckListItem[] = [];
    petsFilters: CheckListItem[] = [new CheckListItem('cat', 'Cats Allowed', false), new CheckListItem('dog', 'Dogs Allowed', false)];
    mediaFilters: CheckListItem[] = [new CheckListItem('photos', 'Photos', false), new CheckListItem('tours', 'Virtual Tours', false)];
    statusFilters: CheckListItem[] = [new CheckListItem('ONMARKET', 'On Market', false), new CheckListItem('APP', 'Pending', false), new CheckListItem('OFFMARKET', 'Off Market', false)];
    selectedListing: ListingResposeDto;

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _userService: UserServiceProxy,
        private _profileService: ProfileServiceProxy,
        private _lintingService: ListingServiceProxy
    ) {
        super(injector);
        let array = new Array();

        for (var i in this.cities.items) {
            var subarray = Object.keys(this.cities.items[i]);
            array.push(...subarray);
        }

        this.citiefFilters = array.map(a => new CheckListItem(a, a, false));
        this.citiesStrings = array;
        this.filteredCities = this.cityCtrl.valueChanges.pipe(
            map((city: string | null) => city ? this._filter(city) : this.citiesStrings.slice()));
        console.log(this.citiesStrings);
    }

    ngOnInit(): void {
        this._userService.getUserForEdit(undefined, this.userId, undefined).subscribe(userResult => {
            this.user = userResult.user;
            this.canChangeUserName = this.user.userName !== AppConsts.userManagement.defaultAdminUserName;
        });



        this._activatedRoute
            .params
            .pipe(
                map(data => data.id),
                filter(id => id !== undefined),
                tap(id => this.userId = id)
            ).subscribe(id => {
                this._userService.getUserForEdit(undefined, this.userId, 'Customer').subscribe(userResult => {
                    this.user = userResult.user;
                    this.getProfilePicture(this.user.id);
                });
            });

        if (this.userId) {
            this.active = true;
            this.setRandomPassword = true;
            this.sendActivationEmail = true;
        }

        this._profileService.getPasswordComplexitySetting().subscribe(passwordComplexityResult => {
            this.passwordComplexitySetting = passwordComplexityResult.setting;
            this.setPasswordComplexityInfo();

        });

        // this.getListings();

    }

    private _filter(value: string): string[] {
        console.log(value);
        const filterValue = value.toLowerCase();
        return this.citiesStrings.filter(city => city.toLowerCase().indexOf(filterValue) === 0);
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || '').trim()) {
            this.selectedCities.push(value.trim());
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.cityCtrl.setValue(null);
        console.log(event);
    }



    getProfilePicture(userId: number): void {
        if (!userId) {
            this.profilePicture = this.appRootUrl() + 'assets/common/images/default-profile-picture.png';
            return;
        }

        this._profileService.getProfilePictureByUser(userId).subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            } else {
                this.profilePicture = this.appRootUrl() + 'assets/common/images/default-profile-picture.png';
            }
        });
    }

    setPasswordComplexityInfo(): void {

        this.passwordComplexityInfo = '<ul>';

        if (this.passwordComplexitySetting.requireDigit) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireDigit_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireLowercase) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireLowercase_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireUppercase) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireUppercase_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requireNonAlphanumeric) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireNonAlphanumeric_Hint') + '</li>';
        }

        if (this.passwordComplexitySetting.requiredLength) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequiredLength_Hint', this.passwordComplexitySetting.requiredLength) + '</li>';
        }

        this.passwordComplexityInfo += '</ul>';
    }


    save(): void {
        let input = new CreateOrUpdateUserInput();
        input.user = this.user;
        input.setRandomPassword = this.setRandomPassword;
        input.sendActivationEmail = this.sendActivationEmail;
        input.assignedRoleNames = ['Customer'];

        this.saving = true;
        this._userService.createOrUpdateUser(input)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();

            });
    }

    getListings(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.input.pets = this.petsFilters.filter(a => a.checked).map(b => b.value);
        this.input.status = this.statusFilters.filter(a => a.checked).map(b => b.value);
        this.input.media = this.mediaFilters.filter(a => a.checked).map(b => b.value);
        this.input.sorting = this.primengTableHelper.getSorting(this.dataTable);
        this.input.maxResultCount = this.primengTableHelper.getMaxResultCount(this.paginator, event);
        this.input.skipCount = this.primengTableHelper.getSkipCount(this.paginator, event);
        this._lintingService.getListing(this.input).subscribe(res => {
            this.primengTableHelper.records = res.listing;
            this.primengTableHelper.totalRecordsCount = res.totalCount;
        });
    }

    fromNow(date: moment.Moment): string {
        return moment(date).fromNow();
    }


    close() {

    }

    selectCity(event: MatAutocompleteSelectedEvent) {
        this.selectedCities.push(event.option.viewValue);
        this.fruitInput.nativeElement.value = '';
        this.cityCtrl.setValue(null);
    }

    removeCity(city: any) {
        const index = this.selectedCities.indexOf(city);

        if (index >= 0) {
            this.selectedCities.splice(index, 1);
        }
    }
}
