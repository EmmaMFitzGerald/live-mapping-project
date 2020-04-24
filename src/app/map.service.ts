/* eslint-disable dot-notation */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { forkJoin, BehaviorSubject } from "rxjs";
import { element } from "protractor";

@Injectable({
    providedIn: "root",
})
// eslint-disable-next-line import/prefer-default-export
export class MapService {
    coronaData$ = new BehaviorSubject<any>(undefined);

    JSONData$: Array<any>;

    countyData$;

    coronaJson$;

    constructor(private http: HttpClient) {
        this.getCsvFile();
        // this.test();
    }

    public initialize(): any {
        const coronaData = this.coronaData$.value;
        console.log("initialize", coronaData);
    }

    getCsvFile(): void {
        forkJoin(
            this.http.get(
                "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv",
                { responseType: "text" }
            ),
            this.http.get("../assets/counties.json")
        )
            .pipe(
                map((res) => {
                    const coronaData = res[0];
                    const countyData = res[1];

                    const lines = coronaData.split("\n");

                    const coronaJson = [];

                    const coronaGeoJson = {
                        type: "FeatureCollection",
                        features: [],
                    };

                    const headers = lines[0].split(",");

                    for (let i = 1; i < lines.length - 1; i++) {
                        const obj = {};
                        const currentline = lines[i].split(",");

                        for (let j = 0; j < headers.length; j++) {
                            obj[headers[j]] = currentline[j];
                        }

                        coronaJson.push(obj);
                    }

                    coronaJson.forEach((element) => {
                        const { state } = element;
                        const { county } = element;

                        countyData["features"].forEach(
                            (el: {
                                properties: {
                                    fullState: any;
                                    name: string;
                                    long: any;
                                    lat: any;
                                };
                            }) => {
                                if (
                                    el.properties.fullState.toLowerCase() ===
                                        state.toLowerCase() &&
                                    el.properties.name.toLowerCase() ===
                                        county.toLowerCase()
                                ) {
                                    element.long = el.properties["_lon"];
                                    element.lat = el.properties["_lat"];
                                }
                            }
                        );
                    });

                    coronaJson.forEach((lineOfData) => {
                        if (lineOfData.long !== undefined) {
                            coronaGeoJson["features"].push({
                                type: "Feature",
                                geometry: {
                                    type: "Point",
                                    coordinates: [
                                        lineOfData.long,
                                        lineOfData.lat,
                                    ],
                                },
                                properties: lineOfData,
                            });
                        }
                    });

                    coronaGeoJson["features"].forEach((item) => {
                        item.properties.numberDate =
                            Date.parse(item.properties.date) /
                            1000 /
                            60 /
                            60 /
                            24;
                    });

                    return coronaGeoJson;
                })
            )
            .subscribe((coronaGeoJson: unknown) => {
                this.coronaData$.next(coronaGeoJson);
            });
    }
}
