/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
import { Component, OnInit } from "@angular/core";
import { MapService } from "../map.service";

@Component({
    selector: "app-map",
    templateUrl: "./map.component.html",
    styleUrls: ["./map.component.css"],
})
// eslint-disable-next-line import/prefer-default-export
export class MapComponent implements OnInit {
    // eslint-disable-next-line no-useless-constructor
    constructor(private mapService: MapService) {}

    totalDeaths = 0;

    totalCases = 0;

    today;

    date: string;

    filterDate(): void {
        const element = (event.currentTarget as unknown) as HTMLInputElement;
        const date = element.value;
        console.log("date", date);
        this.mapService.setDateToFilter(date);
        const formattedDate = new Date(
            parseInt(date, 10) * 1000 * 60 * 60 * 24
        );
        this.date = formattedDate.toDateString();
    }

    ngOnInit(): void {
        this.mapService.coronaData$.subscribe((val: any) => {
            console.log("val ", val);
            if (val !== undefined) {
                this.mapService.initialize();
                this.today = val.features.slice(-1).pop().properties.numberDate;
            }
        });

        this.mapService.selectedDateData$.subscribe((val: any) => {
            // val should have totalDeaths property
            console.log("val:", val);
            this.totalDeaths = val.totalDeaths.toLocaleString();
            console.log(typeof val.totalCases);
            this.totalCases = val.totalCases.toLocaleString();
        });
        const formattedDate = new Date(18283 * 1000 * 60 * 60 * 24);
        this.date = formattedDate.toDateString();
    }
}
