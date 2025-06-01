<ng-container fuseVerticalNavigationContentFooter>
            <div
                style="
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    padding: 0 16px 16px 16px;
                "
            >
                <div
                    style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        background-color: #374151;
                        padding: 8px 16px;
                        border-radius: 16px;
                    "
                >
                    <mat-icon
                        [svgIcon]="'heroicons_outline:user-circle'"
                        style="height: 32px; width: 32px; color: white"
                    ></mat-icon>

                    @if (role == 0) {
                        <div
                            style="
                                flex: 1;
                                text-align: center;
                                margin-left: 8px;
                            "
                        >
                            <div
                                style="
                                    color: white;
                                    font-weight: 500;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                "
                            >
                                {{ names }}
                            </div>
                            <div
                                style="
                                    color: #9ca3af;
                                    font-size: 12px;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                "
                            >
                                Admin
                            </div>
                        </div>
                    } @else if (role == 1) {
                        <div
                            style="
                                flex: 1;
                                text-align: center;
                                margin-left: 8px;
                            "
                        >
                            <div
                                style="
                                    color: white;
                                    font-weight: 500;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                "
                            >
                                {{ names }}
                            </div>
                            <div
                                style="
                                    color: #9ca3af;
                                    font-size: 12px;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                "
                            >
                                Researcher
                            </div>
                        </div>
                    } @else {
                        <div
                            style="
                                flex: 1;
                                text-align: center;
                                margin-left: 8px;
                            "
                        >
                            <div
                                style="
                                    color: white;
                                    font-weight: 500;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                "
                            >
                                {{ names }}
                            </div>
                            <div
                                style="
                                    color: #9ca3af;
                                    font-size: 12px;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                "
                            >
                                Patients
                            </div>
                        </div>
                    }

                    <div style="margin-left: 8px">
                        <user [showAvatar]="false"></user>
                    </div>
                </div>
            </div>
        </ng-container>
