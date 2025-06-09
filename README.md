 filterOptions(id: string, options: any[]) {
    const rawInput = this.searchValues[id] || '';
    const searchTerm = rawInput.trim().toLowerCase();
    this.showDropdown[id] = true;
    let filtered: any[] = [];
    if (id === 'state' && this.formdata['country']) {
      const filteredStates = options.filter(
        (state: any) => state.co === this.formdata['country']
      );
      filtered = searchTerm
        ? filteredStates.filter((s: any) =>
            s.title.toLowerCase().includes(searchTerm)
          )
        : filteredStates;
    } else if (id === 'city' && this.formdata['state']) {
      const filteredCities = options.filter(
        (city: any) => city.st === this.formdata['state']
      );
      filtered = searchTerm
        ? filteredCities.filter((c: any) =>
            c.title.toLowerCase().includes(searchTerm)
          )
        : filteredCities;
    } else {
      filtered = searchTerm
        ? options.filter((opt: any) =>
            opt.title.toLowerCase().includes(searchTerm)
          )
        : options;
    }
    this.filteredOptions[id] = filtered;
    this.focusedIndex[id] = 0;
    // Auto-select if first result starts with the search term
    if (filtered.length && searchTerm) {
      const firstMatch = filtered[0];
      if (firstMatch.title.toLowerCase().startsWith(searchTerm)) {
        this.searchValues[id] = firstMatch.title;
        this.formdata[id] = firstMatch.value;
        this.setCaretPositionToEnd(id);
        // Trigger dependent dropdown reset if needed
        if (id === 'country') {
          this.updateStateOptions(firstMatch.value);
          this.formdata['state'] = null;
          this.searchValues['state'] = '';
          this.filteredOptions['city'] = [];
          this.formdata['city'] = null;
          this.searchValues['city'] = '';
        }
        if (id === 'state') {
          this.updateCityOptions(firstMatch.value);
          this.formdata['city'] = null;
          this.searchValues['city'] = '';
        }
      }
    }
  }

  setCaretPositionToEnd(id: string) {
    setTimeout(() => {
      const inputEl = document.querySelector(
        `input[name="${id}"]`
      ) as HTMLInputElement;
      if (inputEl) {
        const length = inputEl.value.length;
        inputEl.setSelectionRange(length, length);
        inputEl.focus();
      }
    });
  }

  selectOption(id: string, option: any) {
    this.formdata[id] = option.value;
    this.searchValues[id] = option.title;
    this.showDropdown[id] = false;

    if (id === 'country') {
      this.updateStateOptions(option.value);

      // Reset state only if it does not belong to the new country
      const stateElement = this.forms.elements.find(
        (e: any) => e.id === 'state'
      );
      const currentState = stateElement?.options.find(
        (s: any) => s.value === this.formdata['state']
      );
      if (!currentState || currentState.co !== option.value) {
        this.formdata['state'] = null;
        this.searchValues['state'] = '';
        this.formdata['city'] = null;
        this.searchValues['city'] = '';
        this.filteredOptions['city'] = [];
      }
    }

    if (id === 'state') {
      this.updateCityOptions(option.value);

      // Reset city only if it doesn't belong to the new state
      const cityElement = this.forms.elements.find((e: any) => e.id === 'city');
      const currentCity = cityElement?.options.find(
        (c: any) => c.value === this.formdata['city']
      );
      if (!currentCity || currentCity.st !== option.value) {
        this.formdata['city'] = null;
        this.searchValues['city'] = '';
      }
    }

    if (id === 'city') {
      const selectedCity = option;

      // Get city record from city options to retrieve state ID
      const cityElement = this.forms.elements.find((e: any) => e.id === 'city');
      const matchedCity = cityElement?.options.find(
        (c: any) => c.value === selectedCity.value
      );

      if (matchedCity) {
        const stateId = matchedCity.st;

        // Get state record to retrieve country ID
        const stateElement = this.forms.elements.find(
          (e: any) => e.id === 'state'
        );
        const matchedState = stateElement?.options.find(
          (s: any) => s.value === stateId
        );

        if (matchedState) {
          const countryId = matchedState.co;

          // 🟢 Set country if not already selected
          if (this.formdata['country'] !== countryId) {
            const countryElement = this.forms.elements.find(
              (e: any) => e.id === 'country'
            );
            const matchedCountry = countryElement?.options.find(
              (c: any) => c.value === countryId
            );
            if (matchedCountry) {
              this.formdata['country'] = matchedCountry.value;
              this.searchValues['country'] = matchedCountry.title;

              // 🔁 Update state list
              this.updateStateOptions(matchedCountry.value);
            }
          }

          // 🟢 Set state if not already selected
          if (this.formdata['state'] !== matchedState.value) {
            this.formdata['state'] = matchedState.value;
            this.searchValues['state'] = matchedState.title;

            // 🔁 Update city list
            this.updateCityOptions(matchedState.value);
          }
        }
      }
    }
  }

  hideDropdownWithDelay(id: string) {
    setTimeout(() => {
      this.showDropdown[id] = false;
    }, 150);
  }

  handleKeydown(event: KeyboardEvent, id: string) {
    const options = this.filteredOptions[id] || [];
    const maxIndex = options.length - 1;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusedIndex[id] = Math.min(this.focusedIndex[id] + 1, maxIndex);
      this.selectOption(id, options[this.focusedIndex[id]]);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusedIndex[id] = Math.max(this.focusedIndex[id] - 1, 0);
      this.selectOption(id, options[this.focusedIndex[id]]);
    } else if (event.key === 'Enter') {
      event.preventDefault();
    } else if (event.key === 'Tab') {
      // Allow default tab behavior, but close dropdown
      this.showDropdown[id] = false;
    }
  }

  updateStateOptions(selectedCountryId: string) {
    const stateElement = this.forms.elements.find((e: any) => e.id === 'state');
    if (!stateElement) return;

    this.filteredOptions['state'] = stateElement.options.filter(
      (state: any) => `${state.co}` === `${selectedCountryId}`
    );

    this.formdata['state'] = null;
    this.searchValues['state'] = '';
  }

  updateCityOptions(selectedState: string) {
    const cityElement = this.forms.elements.find((e: any) => e.id === 'city');
    if (!cityElement) return;

    this.filteredOptions['city'] = cityElement.options.filter(
      (city: any) => `${city.st}` === `${selectedState}`
    );

    // 🟡 Only clear city if current city is not in the new filtered list
    const currentCity = this.formdata['city'];
    const isCityValid = this.filteredOptions['city'].some(
      (city: any) => city.value === currentCity
    );

    if (!isCityValid) {
      this.formdata['city'] = null;
      this.searchValues['city'] = '';
    }
  }
}










-------------------------

import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { ActivatedRoute } from '@angular/router';
import { ApicontrollerService } from 'app/controller/apicontroller.service';
import { EditappointmentInfoComponent } from '../editappointment-info/editappointment-info.component';

interface appointment {
    apt_row_id: string;
    date_of_apt: string;
    // date_of_req:string;
    doctor_name: string;
    user_contact_number: string;
    time_of_apt: string;
    // time_of_req:string;
    appointment_details: any;
    // appointment_details:{appt_status:any,appt_type:any,virtual_link:any};
    // updatedby_user_name:any
}

interface Patient {
    patient_age: string;
    patient_email: string;
    patient_gender: string;
    patient_name: string;
    user_contact_number: string;
    user_password: string;
    row_id: string;
}

@Component({
    selector: 'app-schedule-patientsappoint',
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatTableModule,
        MatPaginatorModule,
        MatTimepickerModule,
        MatDatepickerModule,
        CommonModule,
    ],
    templateUrl: './schedule-patientsappoint.component.html',
    styleUrl: './schedule-patientsappoint.component.scss',
    encapsulation: ViewEncapsulation.None, // Add this line!
})
export class SchedulePatientsappointComponent {
    value: Date;
    patients: Patient[] = [];

    selectedvalue: string;
    app_type: string = '';

    // slot: string = '';
    availableslot: string[] = ['Physical', 'Virtual'];

    isclicked = false;
    isviewbtn = false;

    row_id: any = '';
    toggle = false;

    timevalue: any;
    datevalue: any;

    isAddNewClicked: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private apiController: ApicontrollerService,
        private _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: { patient: any },
        private dialogRef: MatDialogRef<SchedulePatientsappointComponent> // Inject MatDialogRef
    ) {
        this.patientsId = this.route.snapshot.paramMap.get('id');
        this.viewappointment();

        const userData = localStorage.getItem('userDeatials');

        this.patientDetails = JSON.parse(userData);
        this.patientdata = data.patient;
    }

    addnewbtn() {
        this.isclicked = true;
        this.isviewbtn = false; // Hide view when adding a new one
        //  this.toggle = true
        this.isAddNewClicked = !this.isAddNewClicked; // Toggle the button color
        this.selectedRow = null;
    }

    exitbtn() {
        this.isclicked = false;
        this.isviewbtn = false;

        this.isAddNewClicked = false;
    }

    selectedRow: any = null;

    viewbtn(appointmentdata: any, e: Event) {
        this.row_id = appointmentdata.apt_row_id;
        this.isviewbtn = true;
        this.isclicked = false; // Hide add new when viewing
        this.selectedRow = appointmentdata;

        this.isAddNewClicked = false;
    }

    patientsId!: string | null; // Holds the patientsId ID from the route
    appointmentdata: appointment[] = [];

    // appointment_details: appointmentDetails[]=[]

    appointmentColumns: string[] = [
        'apt_row_id',
        'date_of_apt',
        // 'date_of_req',
        'time_of_apt',
        // 'time_of_req',
        'appointment_status',
        'updatedby_user_type',

        'appointment_Type',
        'Action',
    ];

    patientDetails: Patient | null = null;
    patientdata: any;
    bookedDates: Date[] = [];

    ngOnInit() {
        // console.log("patientsId",this.patientsId)
        this.patientsId = this.route.snapshot.paramMap.get('id');
        this.viewappointment();

        const userData = localStorage.getItem('userDeatials');

        this.patientDetails = JSON.parse(userData);
    }

    selectedDate: Date;
    selectedTime: string;
    timeSlots: string[] = [
        '09:00 AM',
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
        '01:00 PM',
    ]; // Ensure this has values

    selectTime(slot: string) {
        console.log('Selected Slot:', slot, this.selectedDate);
        this.selectedTime = slot;
    }

    async viewappointment() {
        const resp1 = await this.apiController.fetchappointmentdoctor(
            this.patientdata.user_row_id
        );
        this.appointmentdata = resp1.data || [];
        this.bookedDates = this.appointmentdata.map(
            (a) => new Date(a.date_of_apt)
        );

        console.log('bookedDates ', this.bookedDates);
    }

    async requestAppointment() {
        // console.log("time value-",this.timevalue.toTimeString().split(' ')[0], "date value-",this.datevalue.toDateString())

        var data = {
            pat_row_id: this.patientdata.user_row_id,
            time_of_apt: this.selectedTime,
            date_of_apt: this.selectedDate,
            appt_type: this.app_type,
        };

        // console.log("patientdata--->",this,this.patientdata.us)

        console.log('data--->', data);
        const resp = await this.apiController.appointment(data);
    }

    refresh() {
        console.log('refresh----');
        this.viewappointment();
        // window.location.reload();
    }

    editAppointment(appointment: appointment) {
        console.log(appointment.apt_row_id);

        // this.router.navigate(['appointmentdetails', appointment.apt_row_id, this.patientsId]);

        const dialogRef = this._matDialog.open(EditappointmentInfoComponent, {
            data: { appointment: appointment.apt_row_id },
        });
    }

    dateClass = (date: Date) => {
        if (!(date instanceof Date)) return '';

        const dateStr = date.toDateString();
        return this.bookedDates.some(
            (d) => d instanceof Date && d.toDateString() === dateStr
        )
            ? 'booked-date'
            : '';
    };

    disableBookedDates = (date: Date | null): boolean => {
        if (!date) return false;

        const targetDate = new Date(date);
        const dateStr = targetDate.toDateString();

        return !this.bookedDates.some(
            (d) => new Date(d).toDateString() === dateStr
        );
    };
}


<mat-dialog-content class="w-300">
    <h1 class="mb-4 mt-8 text-xl leading-tight tracking-tight">
        Schedule Patient
    </h1>

    <div class="flex min-w-0 flex-auto flex-col">
        <!-- Main -->
        <div class="flex-auto p-6 sm:p-10">
            <!-- CONTENT GOES HERE -->
            <div class="h-400 max-h-400 min-h-400 rounded-2xl">
                <!-- <h1 class="mt-8 text-4xl font-extrabold leading-tight tracking-tight">test work-----------</h1>  -->

                <div
                    class="h-300 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4"
                >
                    <!-- Chat Data -->
                    <div
                        class="flex flex-col rounded-2xl bg-white p-6 shadow-lg transition hover:shadow-xl sm:col-span-2 md:col-span-4 lg:col-span-2"
                    >
                        <div class="m flex">
                            <div class="mt-3 text-xl font-medium text-gray-500">
                                Tele Sessions
                            </div>
                            <button
                                class="fuse-mat-button-large mb-5 ml-5"
                                mat-flat-button
                                [color]="'primary'"
                                [style.background-color]="
                                    isAddNewClicked ? 'orange' : 'deepskyblue'
                                "
                                (click)="addnewbtn()"
                            >
                                Add new
                            </button>

                            <!-- Refresh Button -->
                            <button mat-icon-button (click)="refresh()">
                                <mat-icon class="icon-size-7">refresh</mat-icon>
                            </button>
                        </div>
                        <mat-divider class="my-2"></mat-divider>

                        <div
                            class="table-container"
                            style="max-height: 700px; overflow-y: auto"
                        >
                            <div
                                class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm"
                            >
                                <table
                                    mat-table
                                    [dataSource]="appointmentdata"
                                    class="mat-elevation-z8 w-full min-w-[600px]"
                                >
                                    <!-- ID Column -->
                                    <ng-container matColumnDef="apt_row_id">
                                        <th
                                            mat-header-cell
                                            *matHeaderCellDef
                                            class="text-left"
                                        >
                                            ID
                                        </th>
                                        <td
                                            mat-cell
                                            *matCellDef="
                                                let appoint;
                                                let i = index
                                            "
                                        >
                                            {{ i + 1 }}
                                        </td>
                                    </ng-container>

                                    <!-- Name Column -->
                                    <ng-container matColumnDef="date_of_apt">
                                        <th
                                            mat-header-cell
                                            *matHeaderCellDef
                                            class="text-left"
                                        >
                                            Date
                                        </th>
                                        <td mat-cell *matCellDef="let appoint">
                                            {{ appoint.date_of_apt | date }}
                                        </td>
                                    </ng-container>

                                    <ng-container matColumnDef="time_of_apt">
                                        <th
                                            mat-header-cell
                                            *matHeaderCellDef
                                            class="text-left"
                                        >
                                            Time
                                        </th>
                                        <td mat-cell *matCellDef="let appoint">
                                            {{ appoint.time_of_apt }}
                                        </td>
                                    </ng-container>

                                    <ng-container
                                        matColumnDef="appointment_status"
                                    >
                                        <th
                                            mat-header-cell
                                            *matHeaderCellDef
                                            class="text-left"
                                        >
                                            Status
                                        </th>
                                        <td mat-cell *matCellDef="let appoint">
                                            @if (
                                                appoint.appointment_details
                                                    .appt_status === 0
                                            ) {
                                                {{ 'Pending' }}
                                            } @else if (
                                                appoint.appointment_details
                                                    .appt_status === 1
                                            ) {
                                                {{ 'Accept' }}
                                            } @else if (
                                                appoint.appointment_details
                                                    .appt_status === 2
                                            ) {
                                                {{ 'Reject' }}
                                            } @else if (
                                                appoint.appointment_details
                                                    .appt_status === 3
                                            ) {
                                                {{ 'Complete' }}
                                            } @else if (
                                                appoint.appointment_details
                                                    .appt_status === 4
                                            ) {
                                                {{ 'Cancel' }}
                                            } @else if (
                                                appoint.appointment_details
                                                    .appt_status === 5
                                            ) {
                                                {{ 'Reschedule' }}
                                            }
                                        </td>
                                    </ng-container>

                                    <ng-container
                                        matColumnDef="appointment_Type"
                                    >
                                        <th
                                            mat-header-cell
                                            *matHeaderCellDef
                                            class="text-left"
                                        >
                                            Appointment Type
                                        </th>
                                        <td mat-cell *matCellDef="let appoint">
                                            {{
                                                appoint.appointment_details
                                                    .appt_type
                                            }}
                                        </td>
                                    </ng-container>

                                    <ng-container
                                        matColumnDef="updatedby_user_type"
                                    >
                                        <th
                                            mat-header-cell
                                            *matHeaderCellDef
                                            class="text-left"
                                        >
                                            Update By
                                        </th>
                                        <td mat-cell *matCellDef="let appoint">
                                            {{
                                                appoint.appointment_details
                                                    .updatedby_user_type
                                            }}
                                        </td>
                                    </ng-container>

                                    <ng-container
                                        matColumnDef="Action"
                                        stickyEnd
                                    >
                                        <th
                                            mat-header-cell
                                            *matHeaderCellDef
                                            class="text-left"
                                        >
                                            Action
                                        </th>
                                        <td
                                            mat-cell
                                            *matCellDef="let appoint"
                                            class="sticky-column bg-white"
                                        >
                                            <button
                                                class="fuse-mat-button-large mb-5 ml-5 mt-4"
                                                mat-flat-button
                                                [color]="'primary'"
                                                [style.background-color]="
                                                    selectedRow === appoint
                                                        ? 'orange'
                                                        : 'deepskyblue'
                                                "
                                                (click)="
                                                    editAppointment(
                                                        appoint,
                                                        patientsId
                                                    )
                                                "
                                            >
                                                <!-- View -->
                                                <mat-icon>more_vert</mat-icon>
                                            </button>
                                        </td>
                                    </ng-container>

                                    <!-- Table Header & Rows -->
                                    <tr
                                        mat-header-row
                                        *matHeaderRowDef="appointmentColumns"
                                        class="bg-gray-200 text-sm font-bold md:text-lg"
                                    ></tr>
                                    <tr
                                        mat-row
                                        *matRowDef="
                                            let row;
                                            columns: appointmentColumns
                                        "
                                        class="cursor-pointer transition hover:bg-blue-100"
                                    ></tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    @if (isclicked === true) {
                        <div
                            class="flex flex-col items-center rounded-2xl bg-white p-6 shadow-lg transition hover:shadow-xl sm:col-span-2 md:col-span-4 lg:col-span-2"
                        >
                        <div class="mt-4 flex w-full justify-between text-gray-600">
                            <div>
                              <div class="mb-10 text-2xl font-semibold">
                                Appointment:
                              </div>
                          
                              <div class="calendar-container" style="padding: 20px; width: 300px">
                                <mat-calendar
                                [(selected)]="selectedDate"
                                [dateClass]="dateClass"
                                [dateFilter]="disableBookedDates">
                              </mat-calendar>
                                                        
                                <div *ngIf="selectedDate">
                                  <p>You selected: {{ selectedDate | date }}</p>
                                </div>
                              </div>
                          
                              <div class="time-section mb-4 mt-6">
                                <h3 class="text-lg font-semibold">Select Time</h3>
                                <div class="time-slots mt-4 flex flex-wrap gap-2">
                                  <button
                                    *ngFor="let slot of timeSlots; trackBy: trackBySlot"
                                    class="time-chip"
                                    [class.selected]="selectedTime === slot"
                                    (click)="selectTime(slot)"
                                    [ngStyle]="{
                                      'background-color': selectedTime === slot ? 'deepskyblue' : 'green',
                                      color: selectedTime === slot ? 'white' : 'black'
                                    }"
                                  >
                                    {{ slot }}
                                  </button>
                                </div>
                              </div>
                          
                              <mat-form-field appearance="outline" class="w-full">
                                <mat-label>Appointment type</mat-label>
                                <mat-select [(ngModel)]="app_type">
                                  <mat-option *ngFor="let slotvalue of availableslot" [value]="slotvalue">
                                    {{ slotvalue }}
                                  </mat-option>
                                </mat-select>
                              </mat-form-field>
                          
                              <button
                                class="fuse-mat-button-large mb-5 ml-5 text-white"
                                mat-flat-button
                                [style.background-color]="'deepskyblue'"
                                (click)="requestAppointment()"
                              >
                                Make Appointment
                              </button>
                            </div>
                          </div>
                          
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>
</mat-dialog-content>












