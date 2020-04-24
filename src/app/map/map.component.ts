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

    ngOnInit(): void {
        this.mapService.coronaData$.subscribe((val: any) => {
            if (val !== undefined) {
                console.log("not undefined")
                this.mapService.initialize();
            }
        });
    }
}
