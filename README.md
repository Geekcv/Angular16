@if (role == 1) {
    <div class="flex min-w-0 flex-auto flex-col">
        <!-- Main -->
        <div class="flex-auto p-6 sm:p-10">
            <div
                class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end"
            >
                <!-- Button Group (aligned in a row on large screens) -->
                <div class="flex gap-3">
                    <!-- Search Field -->
                    <mat-form-field
                        class="w-full sm:w-72"
                        [subscriptSizing]="'dynamic'"
                    >
                        <mat-icon
                            matPrefix
                            class="icon-size-5"
                            [svgIcon]="'heroicons_solid:magnifying-glass'"
                        >
                        </mat-icon>
                        <input
                            (input)="filterByQuery(query.value)"
                            placeholder="Search  Patients"
                            matInput
                            #query
                        />
                    </mat-form-field>

                    <!-- Export Button -->
                    <button mat-icon-button (click)="exportToExcel()">
                        <mat-icon
                            svgIcon="heroicons_outline:arrow-down-circle"
                        ></mat-icon>
                    </button>

                    <!-- Refresh Button -->
                    <button mat-icon-button (click)="refresh()">
                        <mat-icon class="icon-size-7">refresh</mat-icon>
                    </button>

                    <!-- Filter Button -->
                    <button mat-icon-button (click)="toggleFilterPanel()">
                        <mat-icon>filter_list</mat-icon>
                    </button>

                    <!-- Add Doctor Button -->
                    <button mat-icon-button (click)="addpatientdialog()">
                        <mat-icon class="icon-size-7">control_point</mat-icon>
                    </button>
                </div>
            </div>

            <!-- Filter Panel (Hidden by default) -->
            @if (filterPanelVisible) {
                <div class="filter-panel">
                    <mat-form-field appearance="fill" style="margin: 20px">
                        <mat-label>Filter by Name</mat-label>
                        <input
                            matInput
                            [(ngModel)]="filterName"
                            (ngModelChange)="applyFilter()"
                        />
                    </mat-form-field>

                    <mat-form-field appearance="fill" style="margin: 20px">
                        <mat-label>Filter by Email</mat-label>
                        <input
                            matInput
                            [(ngModel)]="filterEmail"
                            (ngModelChange)="applyFilter()"
                        />
                    </mat-form-field>

                    <mat-form-field appearance="fill" style="margin: 20px">
                        <mat-label>Filter by Contact</mat-label>
                        <input
                            matInput
                            [(ngModel)]="filterContact"
                            (ngModelChange)="applyFilter()"
                        />
                    </mat-form-field>

                    <button
                        mat-raised-button
                        color="primary"
                        (click)="clearFilters()"
                        class="w-74 ml-2 mt-0 h-10 rounded-md px-4 py-2 text-base text-white"
                    >
                        Clear Filters
                    </button>
                </div>
            }
            <div
                class="w-full max-w-full rounded-2xl border border-gray-300 bg-white p-4 shadow-lg"
            >
                <h2 class="mb-4 text-lg font-bold text-gray-700 sm:text-2xl">
                    All Patients
                </h2>

                <div class="overflow-auto rounded-lg">
                    <table
                        mat-table
                        matSort
                        [dataSource]="patient"
                        class="mat-elevation-z8 w-full min-w-[600px]"
                    >
                        <!-- Doctor ID Column -->
                        <ng-container matColumnDef="user_row_id">
                            <th
                                mat-header-cell
                                mat-sort-header
                                *matHeaderCellDef
                                class="text-left"
                            >
                                ID
                            </th>
                            <td mat-cell *matCellDef="let row; let i = index">
                                {{
                                    i +
                                        1 +
                                        patient.paginator.pageIndex *
                                            patient.paginator.pageSize
                                }}
                            </td>
                        </ng-container>

                        <!-- Name Column -->
                        <ng-container matColumnDef="patient_name">
                            <th
                                mat-header-cell
                                mat-sort-header="patient_name"
                                *matHeaderCellDef
                                class="text-left"
                            >
                                Name
                            </th>
                            <td mat-cell *matCellDef="let row">
                                {{ row.patient_name }}
                            </td>
                        </ng-container>

                        <!-- Email Column -->
                        <ng-container matColumnDef="patient_email">
                            <th
                                mat-header-cell
                                mat-sort-header="patient_email"
                                *matHeaderCellDef
                                class="text-left"
                            >
                                Email
                            </th>
                            <td mat-cell *matCellDef="let row">
                                {{ row.patient_email }}
                            </td>
                        </ng-container>

                        <!-- Contact Column -->
                        <ng-container matColumnDef="user_contact_number">
                            <th
                                mat-header-cell
                                mat-sort-header="user_contact_number"
                                *matHeaderCellDef
                                class="text-left"
                            >
                                Contact
                            </th>
                            <td mat-cell *matCellDef="let row">
                                {{ row.user_contact_number }}
                            </td>
                        </ng-container>

                        <!-- Qualifications Column -->
                        <ng-container matColumnDef="qualifications">
                            <th
                                mat-header-cell
                                mat-sort-header="qualifications"
                                *matHeaderCellDef
                                class="text-left"
                            >
                                Qualifications
                            </th>
                            <td mat-cell *matCellDef="let row">
                                {{ row.qualifications }}
                            </td>
                        </ng-container>

                        <!-- Qualifications Details Column -->
                        <ng-container matColumnDef="qualifications_details">
                            <th
                                mat-header-cell
                                mat-sort-header="qualifications_details"
                                *matHeaderCellDef
                                class="text-left"
                            >
                                Qualifications Details
                            </th>
                            <td mat-cell *matCellDef="let row">
                                {{ row.qualifications_details }}
                            </td>
                        </ng-container>

                        <!-- Actions Column -->
                        <ng-container matColumnDef="actions" stickyEnd>
                            <th
                                mat-header-cell
                                *matHeaderCellDef
                                class="sticky-column border-l border-gray-300 bg-gray-100 text-center"
                            >
                                Actions
                            </th>
                            <td
                                mat-cell
                                *matCellDef="let row"
                                class="sticky-column action-cell"
                            >
                                <div class="action-buttons">
                                    <button>
                                        <img
                                            class="h-8 w-8"
                                            src="images/logo/login.svg"
                                        />
                                    </button>
                                    <button
                                        mat-icon-button
                                        color="primary"
                                        (click)="
                                            viewpatientDetails(row.user_row_id)
                                        "
                                    >
                                        <mat-icon>visibility</mat-icon>
                                    </button>
                                    <button mat-icon-button>
                                        <mat-icon svgIcon="edit"></mat-icon>
                                    </button>
                                    <button mat-icon-button>
                                        <mat-icon>save</mat-icon>
                                    </button>
                                    <button mat-icon-button>
                                        <mat-icon>lock</mat-icon>
                                    </button>
                                    <button
                                        mat-icon-button
                                        (click)="suspendPatient(row)"
                                    >
                                        <mat-icon>pause_presentation</mat-icon>
                                    </button>
                                    <button
                                        mat-icon-button
                                        color="warn"
                                        (click)="deletebtn(row.user_row_id)"
                                    >
                                        <mat-icon>delete</mat-icon>
                                    </button>
                                </div>
                            </td>
                        </ng-container>

                        <!-- Table Header & Rows -->
                        <tr
                            mat-header-row
                            *matHeaderRowDef="displayedColumns"
                            class="bg-gray-200 text-sm font-bold md:text-lg"
                        ></tr>
                        <tr
                            mat-row
                            *matRowDef="let row; columns: displayedColumns"
                            class="cursor-pointer transition hover:bg-blue-100"
                        ></tr>
                    </table>
                </div>

                <!-- Conditional Paginator -->
                @if (!isSearchActive) {
                    <div
                        class="mt-4 flex flex-col items-center justify-between gap-2 border-t pt-4 sm:flex-row"
                    >
                        <span class="text-xs text-gray-500 sm:text-sm">
                            Showing {{ patient.data.length }} patients
                        </span>
                        <mat-paginator
                            [pageSize]="10"
                            [pageSizeOptions]="[5, 10, 20, 30, 40]"
                            showFirstLastButtons
                        >
                        </mat-paginator>
                    </div>
                }
            </div>
        </div>
    </div>
}


import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApicontrollerService } from 'app/controller/apicontroller.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { DeldialogComponent } from '../../dialog/deldialog/deldialog.component';
import { AddpatientdialogComponent } from '../../dialog/doctor/addpatientdialog/addpatientdialog.component';
import { SuspendPatientComponent } from '../../dialog/suspend-patient/suspend-patient.component';

interface Patient {
    patient_age: string;
    patient_email: string;
    patient_gender: string;
    patient_name: string;
    user_contact_number: string;
    user_password: string;
    user_row_id: string;
    qualifications_details: string;
    qualifications: string;
}

@Component({
    selector: 'app-viewpatients',
    imports: [
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        CommonModule,
        FormsModule,
        MatSortModule,
    ],
    templateUrl: './viewpatients.component.html',
    styleUrl: './viewpatients.component.css',
})
export class ViewpatientsComponent {
    // patient: Patient[] = [];

    displayedColumns: string[] = [
        'user_row_id',
        'patient_name',
        'patient_email',
        'user_contact_number',
        // 'patient_gender',

        'qualifications',
        'qualifications_details',

        'actions',
    ];

    role: any = '';

    isSearchActive = false;

    patient = new MatTableDataSource<Patient>([]); // Use MatTableDataSource for pagination

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private Apicontroller: ApicontrollerService,
        private router: Router,
        private _matDialog: MatDialog
    ) {
        this.role = localStorage.getItem('role');

        // console.log("my role",this.role)
    }

    ngOnInit(): void {
        this.Patients();
    }

    ngAfterViewInit() {
        this.patient.paginator = this.paginator;
        this.patient.sort = this.sort;
    }

    page: number = 1; // Default to first page
    async Patients() {
        try {
            const resp = await this.Apicontroller.fetchPatients(
                'common',
                this.page
            );
            console.log('Patients', resp);
            this.patient.data = resp.data as Patient[]; // Type assert to Doctor[]
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    }

    viewDoctorDetails(patient: Patient) {
        this.router.navigate(['patientDetails', patient.user_row_id]);
    }

    //   filterByQuery(query: string): void {
    //     const trimmedQuery = query.trim().toLowerCase();

    //     if (trimmedQuery) {
    //         this.isSearchActive = true;
    //         this.patient.filter = trimmedQuery;

    //         if (this.patient.paginator) {
    //             this.patient.paginator.firstPage(); // Reset to first page after search
    //         }
    //     } else {
    //         this.isSearchActive = false;
    //         this.patient.filter = ''; // Clear filter

    //         // Reset the paginator and restore original data
    //         setTimeout(() => {
    //             this.patient.paginator = this.paginator;
    //         });
    //     }
    // }

    exportToExcel(): void {
        const dataToExport = this.patient.data.map((patient) => ({
            ID: patient.user_row_id,
            Name: patient.patient_name,
            Email: patient.patient_email,
            Gender: patient.patient_gender,
            Contact: patient.user_contact_number,
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Doctors');

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });
        const data = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        saveAs(data, 'Patients_List.xlsx');
    }

    refresh() {
        console.log('refresh----');
        this.Patients();
        // window.location.reload();
    }

    addpatientdialog() {
        const dialogRef = this._matDialog.open(AddpatientdialogComponent, {
            position: {
                right: '1%',
            },
        });
    }

    deletebtn(patient: Patient) {
        console.log('delete click ');
        const dialogRef = this._matDialog.open(DeldialogComponent, {
            data: { patient: patient },
        }); // ,{ data: { doctordata: user_row_id  }}
        // dialogRef.afterClosed().subscribe((result) => {
        //     console.log('dialog was closed!');
        // });

        console.log('delete.....');
    }

    viewpatientDetails(patient_rowId: string) {
        console.log('viewdata', patient_rowId);
        // this.router.navigate(['patientDetails', patient_rowId]);
        this.router.navigate(['patientpanel', patient_rowId]);
    }

    filterPanelVisible = false; // Track visibility of filter panel
    filterName = '';
    filterEmail = '';
    filterContact = '';

    toggleFilterPanel() {
        this.filterPanelVisible = !this.filterPanelVisible;
    }

    applyFilter() {
        const filteredData = this.patient.data.filter(
            (patient) =>
                (this.filterName
                    ? patient.patient_name
                          .toLowerCase()
                          .includes(this.filterName.toLowerCase())
                    : true) &&
                (this.filterEmail
                    ? patient.patient_email
                          .toLowerCase()
                          .includes(this.filterEmail.toLowerCase())
                    : true) &&
                (this.filterContact
                    ? patient.user_contact_number.includes(this.filterContact)
                    : true)
        );
        this.patient.data = filteredData;
    }

    clearFilters() {
        this.filterName = '';
        this.filterEmail = '';
        this.filterContact = '';
        this.Patients(); // Reload original data
    }

    filterByQuery(query: string): void {
        const trimmedQuery = query.trim().toLowerCase();

        if (trimmedQuery) {
            this.isSearchActive = true;
            this.patient.filter = trimmedQuery;

            if (this.patient.paginator) {
                this.patient.paginator.firstPage(); // Reset to first page after search
            }
        } else {
            this.isSearchActive = false;
            this.patient.filter = ''; // Clear filter

            // Reset the paginator and restore original data
            setTimeout(() => {
                this.patient.paginator = this.paginator;
            });
        }
    }

    suspendPatient(patient: any) {
        // Logic to suspend the patient
        // this.fetchSefesficpatients();
        console.log('row id ', patient);

        console.log('Suspend Patient', patient);

        const dialogRef = this._matDialog.open(SuspendPatientComponent, {
            data: { patient: patient },
        });
    }
}










@if (role == 1) {
    <div class="flex min-w-0 flex-auto flex-col">
        <!-- Main -->
        <div class="flex-auto p-6 sm:p-10">
            <div
                class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end"
            >
                <!-- Button Group (aligned in a row on large screens) -->
                <div class="flex gap-3">
                    <!-- Search Field -->
                    <mat-form-field
                        class="w-full sm:w-72"
                        [subscriptSizing]="'dynamic'"
                    >
                        <mat-icon
                            matPrefix
                            class="icon-size-5"
                            [svgIcon]="'heroicons_solid:magnifying-glass'"
                        >
                        </mat-icon>
                        <input
                            (input)="filterByQuery(query.value)"
                            placeholder="Search  Patients"
                            matInput
                            #query
                        />
                    </mat-form-field>

                    <!-- Export Button -->
                    <button mat-icon-button (click)="exportToExcel()">
                        <mat-icon
                            svgIcon="heroicons_outline:arrow-down-circle"
                        ></mat-icon>
                    </button>

                    <!-- Refresh Button -->
                    <button mat-icon-button (click)="refresh()">
                        <mat-icon class="icon-size-7">refresh</mat-icon>
                    </button>

                    <!-- Filter Button -->
                    <button mat-icon-button (click)="toggleFilterPanel()">
                        <mat-icon>filter_list</mat-icon>
                    </button>

                    <!-- Add Doctor Button -->
                    <button mat-icon-button (click)="addpatientdialog()">
                        <mat-icon class="icon-size-7">control_point</mat-icon>
                    </button>
                </div>
            </div>

            <!-- Filter Panel (Hidden by default) -->
            @if (filterPanelVisible) {
                <div class="filter-panel">
                    <mat-form-field appearance="fill" style="margin: 20px">
                        <mat-label>Filter by Name</mat-label>
                        <input
                            matInput
                            [(ngModel)]="filterName"
                            (ngModelChange)="applyFilter()"
                        />
                    </mat-form-field>

                    <mat-form-field appearance="fill" style="margin: 20px">
                        <mat-label>Filter by Email</mat-label>
                        <input
                            matInput
                            [(ngModel)]="filterEmail"
                            (ngModelChange)="applyFilter()"
                        />
                    </mat-form-field>

                    <mat-form-field appearance="fill" style="margin: 20px">
                        <mat-label>Filter by Contact</mat-label>
                        <input
                            matInput
                            [(ngModel)]="filterContact"
                            (ngModelChange)="applyFilter()"
                        />
                    </mat-form-field>

                    <button
                        mat-raised-button
                        color="primary"
                        (click)="clearFilters()"
                        class="w-74 ml-2 mt-0 h-10 rounded-md px-4 py-2 text-base text-white"
                    >
                        Clear Filters
                    </button>
                </div>
            }
            <div
                class="w-full max-w-full rounded-2xl border border-gray-300 bg-white p-4 shadow-lg"
            >
                <h2 class="mb-4 text-lg font-bold text-gray-700 sm:text-2xl">
                    All Patients
                </h2>

                <div class="w-full max-w-full rounded-2xl border border-gray-300 bg-white p-4 shadow-lg">
                    <h2 class="mb-4 text-lg font-bold text-gray-700 sm:text-2xl">All Patients</h2>
                  
                    <div class="overflow-auto rounded-lg">
                      <table mat-table [dataSource]="patient" class="mat-elevation-z8 w-full min-w-[600px]">
                  
                        <!-- ID -->
                        <ng-container matColumnDef="user_row_id">
                          <th mat-header-cell *matHeaderCellDef>ID</th>
                          <td mat-cell *matCellDef="let row">{{ row.user_row_id }}</td>
                        </ng-container>
                  
                        <!-- Name -->
                        <ng-container matColumnDef="patient_name">
                          <th mat-header-cell *matHeaderCellDef>Name</th>
                          <td mat-cell *matCellDef="let row">
                            <ng-container *ngIf="editRowId === row.user_row_id; else viewName">
                              <input [(ngModel)]="row.patient_name" class="border p-1 rounded" />
                            </ng-container>
                            <ng-template #viewName>{{ row.patient_name }}</ng-template>
                          </td>
                        </ng-container>
                  
                        <!-- Email -->
                        <ng-container matColumnDef="patient_email">
                          <th mat-header-cell *matHeaderCellDef>Email</th>
                          <td mat-cell *matCellDef="let row">
                            <ng-container *ngIf="editRowId === row.user_row_id; else viewEmail">
                              <input [(ngModel)]="row.patient_email" class="border p-1 rounded" />
                            </ng-container>
                            <ng-template #viewEmail>{{ row.patient_email }}</ng-template>
                          </td>
                        </ng-container>
                  
                        <!-- Contact -->
                        <ng-container matColumnDef="user_contact_number">
                          <th mat-header-cell *matHeaderCellDef>Contact</th>
                          <td mat-cell *matCellDef="let row">
                            <ng-container *ngIf="editRowId === row.user_row_id; else viewContact">
                              <input [(ngModel)]="row.user_contact_number" class="border p-1 rounded" />
                            </ng-container>
                            <ng-template #viewContact>{{ row.user_contact_number }}</ng-template>
                          </td>
                        </ng-container>
                  
                        <!-- Qualifications -->
                        <ng-container matColumnDef="qualifications">
                          <th mat-header-cell *matHeaderCellDef>Qualifications</th>
                          <td mat-cell *matCellDef="let row">
                            <ng-container *ngIf="editRowId === row.user_row_id; else viewQual">
                              <input [(ngModel)]="row.qualifications" class="border p-1 rounded" />
                            </ng-container>
                            <ng-template #viewQual>{{ row.qualifications }}</ng-template>
                          </td>
                        </ng-container>
                  
                        <!-- Qualifications Details -->
                        <ng-container matColumnDef="qualifications_details">
                          <th mat-header-cell *matHeaderCellDef>Details</th>
                          <td mat-cell *matCellDef="let row">
                            <ng-container *ngIf="editRowId === row.user_row_id; else viewDetails">
                              <input [(ngModel)]="row.qualifications_details" class="border p-1 rounded" />
                            </ng-container>
                            <ng-template #viewDetails>{{ row.qualifications_details }}</ng-template>
                          </td>
                        </ng-container>
                  
                        <!-- Actions -->
                        <ng-container matColumnDef="actions">
                          <th mat-header-cell *matHeaderCellDef>Actions</th>
                          <td mat-cell *matCellDef="let row">
                            <ng-container *ngIf="editRowId === row.user_row_id; else actionButtons">
                              <button mat-button color="primary" (click)="saveRow(row)">Save</button>
                              <button mat-button (click)="cancelEdit()">Cancel</button>
                            </ng-container>
                            <ng-template #actionButtons>
                              <button mat-icon-button color="accent" (click)="editRow(row.user_row_id)">
                                <mat-icon>edit</mat-icon>
                              </button>
                              <button mat-icon-button color="warn" (click)="deleteRow(row.user_row_id)">
                                <mat-icon>delete</mat-icon>
                              </button>
                            </ng-template>
                          </td>
                        </ng-container>
                  
                        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                      </table>
                    </div>
                  </div>
                  
                <!-- Conditional Paginator -->
                @if (!isSearchActive) {
                    <div
                        class="mt-4 flex flex-col items-center justify-between gap-2 border-t pt-4 sm:flex-row"
                    >
                        <span class="text-xs text-gray-500 sm:text-sm">
                            Showing {{ patient.data.length }} patients
                        </span>
                        <mat-paginator
                            [pageSize]="10"
                            [pageSizeOptions]="[5, 10, 20, 30, 40]"
                            showFirstLastButtons
                        >
                        </mat-paginator>
                    </div>
                }
            </div>
        </div>
    </div>
}





import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApicontrollerService } from 'app/controller/apicontroller.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { DeldialogComponent } from '../../dialog/deldialog/deldialog.component';
import { AddpatientdialogComponent } from '../../dialog/doctor/addpatientdialog/addpatientdialog.component';
import { SuspendPatientComponent } from '../../dialog/suspend-patient/suspend-patient.component';

interface Patient {
    patient_age: string;
    patient_email: string;
    patient_gender: string;
    patient_name: string;
    user_contact_number: string;
    user_password: string;
    user_row_id: string;
    qualifications_details: string;
    qualifications: string;
}

@Component({
    selector: 'app-viewpatients',
    imports: [
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        CommonModule,
        FormsModule,
        MatSortModule,
    ],
    templateUrl: './viewpatients.component.html',
    styleUrl: './viewpatients.component.css',
})
export class ViewpatientsComponent {
    // patient: Patient[] = [];

    displayedColumns: string[] = [
        'user_row_id',
        'patient_name',
        'patient_email',
        'user_contact_number',
        // 'patient_gender',

        'qualifications',
        'qualifications_details',

        'actions',
    ];

    role: any = '';

    isSearchActive = false;

    patient = new MatTableDataSource<Patient>([]); // Use MatTableDataSource for pagination

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private Apicontroller: ApicontrollerService,
        private router: Router,
        private _matDialog: MatDialog
    ) {
        this.role = localStorage.getItem('role');

        // console.log("my role",this.role)
    }

    ngOnInit(): void {
        this.Patients();
    }

    ngAfterViewInit() {
        this.patient.paginator = this.paginator;
        this.patient.sort = this.sort;
    }

    page: number = 1; // Default to first page
    async Patients() {
        try {
            const resp = await this.Apicontroller.fetchPatients(
                'common',
                this.page
            );
            console.log('Patients', resp);
            this.patient.data = resp.data as Patient[]; // Type assert to Doctor[]
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    }

    viewDoctorDetails(patient: Patient) {
        this.router.navigate(['patientDetails', patient.user_row_id]);
    }

    //   filterByQuery(query: string): void {
    //     const trimmedQuery = query.trim().toLowerCase();

    //     if (trimmedQuery) {
    //         this.isSearchActive = true;
    //         this.patient.filter = trimmedQuery;

    //         if (this.patient.paginator) {
    //             this.patient.paginator.firstPage(); // Reset to first page after search
    //         }
    //     } else {
    //         this.isSearchActive = false;
    //         this.patient.filter = ''; // Clear filter

    //         // Reset the paginator and restore original data
    //         setTimeout(() => {
    //             this.patient.paginator = this.paginator;
    //         });
    //     }
    // }

    exportToExcel(): void {
        const dataToExport = this.patient.data.map((patient) => ({
            ID: patient.user_row_id,
            Name: patient.patient_name,
            Email: patient.patient_email,
            Gender: patient.patient_gender,
            Contact: patient.user_contact_number,
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Doctors');

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });
        const data = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        saveAs(data, 'Patients_List.xlsx');
    }

    refresh() {
        console.log('refresh----');
        this.Patients();
        // window.location.reload();
    }

    addpatientdialog() {
        const dialogRef = this._matDialog.open(AddpatientdialogComponent, {
            position: {
                right: '1%',
            },
        });
    }

    deletebtn(patient: Patient) {
        console.log('delete click ');
        const dialogRef = this._matDialog.open(DeldialogComponent, {
            data: { patient: patient },
        }); // ,{ data: { doctordata: user_row_id  }}
        // dialogRef.afterClosed().subscribe((result) => {
        //     console.log('dialog was closed!');
        // });

        console.log('delete.....');
    }

    viewpatientDetails(patient_rowId: string) {
        console.log('viewdata', patient_rowId);
        // this.router.navigate(['patientDetails', patient_rowId]);
        this.router.navigate(['patientpanel', patient_rowId]);
    }

    filterPanelVisible = false; // Track visibility of filter panel
    filterName = '';
    filterEmail = '';
    filterContact = '';

    toggleFilterPanel() {
        this.filterPanelVisible = !this.filterPanelVisible;
    }

    applyFilter() {
        const filteredData = this.patient.data.filter(
            (patient) =>
                (this.filterName
                    ? patient.patient_name
                          .toLowerCase()
                          .includes(this.filterName.toLowerCase())
                    : true) &&
                (this.filterEmail
                    ? patient.patient_email
                          .toLowerCase()
                          .includes(this.filterEmail.toLowerCase())
                    : true) &&
                (this.filterContact
                    ? patient.user_contact_number.includes(this.filterContact)
                    : true)
        );
        this.patient.data = filteredData;
    }

    clearFilters() {
        this.filterName = '';
        this.filterEmail = '';
        this.filterContact = '';
        this.Patients(); // Reload original data
    }

    filterByQuery(query: string): void {
        const trimmedQuery = query.trim().toLowerCase();

        if (trimmedQuery) {
            this.isSearchActive = true;
            this.patient.filter = trimmedQuery;

            if (this.patient.paginator) {
                this.patient.paginator.firstPage(); // Reset to first page after search
            }
        } else {
            this.isSearchActive = false;
            this.patient.filter = ''; // Clear filter

            // Reset the paginator and restore original data
            setTimeout(() => {
                this.patient.paginator = this.paginator;
            });
        }
    }

    suspendPatient(patient: any) {
        // Logic to suspend the patient
        // this.fetchSefesficpatients();
        console.log('row id ', patient);

        console.log('Suspend Patient', patient);

        const dialogRef = this._matDialog.open(SuspendPatientComponent, {
            data: { patient: patient },
        });
    }

    editRowId: number | null = null;

    // Start editing
    editRow(rowId: number) {
      this.editRowId = rowId;
    }
  
    // Save changes
    saveRow(row: any) {
      console.log('Saving row:', row);
      this.editRowId = null;
    }
  
    // Cancel editing
    cancelEdit() {
      this.editRowId = null;
    }
  
}










