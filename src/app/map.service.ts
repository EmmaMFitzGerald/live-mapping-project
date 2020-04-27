/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-plusplus */
/* eslint-disable dot-notation */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { forkJoin, BehaviorSubject, Subject } from "rxjs";

declare let mapboxgl: any;

@Injectable({
    providedIn: "root",
})
// eslint-disable-next-line import/prefer-default-export
export class MapService {
    coronaData$ = new BehaviorSubject<any>(undefined);

    selectedDateData$ = new Subject<unknown>();

    JSONData$: Array<any>;

    coronaJson$;

    public map: any;

    constructor(private http: HttpClient) {
        this.convertCoronaData();
    }

    setDateToFilter(numberDate: string): any {
        this.map.setFilter("cases", [
            "==",
            ["number", ["get", "numberDate"]],
            parseInt(numberDate, 10),
        ]);
        this.map.setFilter("deaths", [
            "==",
            ["number", ["get", "numberDate"]],
            // eslint-disable-next-line radix
            parseInt(numberDate, 10),
        ]);

        // Tell subsscirbers to selectedDateData$ the total to date
        this.selectedDateData$.next({
            totalDeaths: this.updateDeath(parseInt(numberDate, 10)),
            totalCases: this.updateCase(parseInt(numberDate, 10)),
        });
    }

    updateDeath(numberDate: number): number {
        const coronaData = this.coronaData$.getValue();

        const total = [];

        const array = coronaData.features;

        array.forEach((element) => {
            if (element.properties.numberDate === numberDate) {
                if (element.properties.deaths !== 0) {
                    total.push(element.properties.deaths);
                }
            }
        });

        let newTotal = 0;

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < total.length; i++) {
            newTotal += Number(total[i]);
        }

        console.log("death total", total);
        console.log("total deaths:", newTotal);
        return newTotal; // = this.selectedDateData
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    updateCase(numberDate: number) {
        const coronaData = this.coronaData$.getValue();

        const total = [];

        const array = coronaData.features;

        console.log(array);

        array.forEach(
            (element: {
                properties: { numberDate: number; cases: number };
            }) => {
                if (element.properties.numberDate === numberDate) {
                    if (element.properties.cases !== 0) {
                        total.push(element.properties.cases);
                    }
                }
            }
        );

        let newTotal = 0;

        for (let i = 0; i < total.length; i++) {
            newTotal += Number(total[i]);
        }
        console.log("case total", total);
        console.log("total cases:", newTotal);
        return newTotal; // = this.selectedDateData$
    }

    public initialize(): any {
        const coronaData = this.coronaData$.value;

        console.log(typeof coronaData.features[0].properties.cases);
        console.log("coronaData", coronaData);
        mapboxgl.accessToken =
            "pk.eyJ1IjoiZW1tYW1maXR6Z2VyYWxkIiwiYSI6ImNrOTA5bmFiOTIxcXAzZnFxdWt1OXJ6d3YifQ.fOuVi7c-DSQIGwXyrqb8ZQ";
        this.map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v9",
            zoom: 3,
            center: [-98, 38],
        });

        this.map.on("style.load", () => {
            console.log("inside map", coronaData);

            this.map.addSource("corona-geojson", {
                type: "geojson",
                data: coronaData,
            });

            this.map.addLayer({
                id: "cases",
                type: "circle",
                source: "corona-geojson",
                filter: ["==", ["number", ["get", "numberDate"]], 18281],
                paint: {
                    "circle-color": [
                        "step",
                        ["get", "cases"],
                        "#346BFD",
                        1,
                        "#144CDF",
                        2,
                        "#184BD1",
                        3,
                        "#0F43CA",
                        4,
                        "#0B3CBB",
                        5,
                        "#0D3AB0",
                        10,
                        "#0C37A7",
                        20,
                        "#0B349F",
                        30,
                        "#09319B",
                        40,
                        "#123697",
                        50,
                        "#10328D",
                        100,
                        "#10128D",
                        200,
                        "#0D0F82",
                        300,
                        "#0F1175",
                        400,
                        "#0B0C4F",
                        500,
                        "#07083C",
                        1000,
                        "#02021f",
                        2000,
                        "#010112",
                    ],
                    "circle-radius": [
                        "step",
                        ["get", "cases"],
                        0,
                        1,
                        2,
                        2,
                        3,
                        3,
                        4,
                        4,
                        5,
                        5,
                        6,
                        6,
                        7,
                        7,
                        8,
                        8,
                        9,
                        9,
                        10,
                        10,
                        11,
                        11,
                        12,
                        12,
                        13,
                        13,
                        14,
                        14,
                        15,
                        50,
                        20,
                        100,
                        25,
                        200,
                        30,
                        500,
                        35,
                        1000,
                        40,
                        2000,
                        50,
                        3000,
                        60,
                    ],
                    "circle-opacity": 0.8,
                },
            });

            this.map.addLayer({
                id: "deaths",
                type: "circle",
                source: "corona-geojson",
                filter: ["==", ["number", ["get", "numberDate"]], 18281],
                paint: {
                    "circle-color": [
                        "step",
                        ["get", "deaths"],
                        "#FE745C",
                        1,
                        "#E93F21",
                        2,
                        "#DC3A1E",
                        3,
                        "#CE2F14",
                        4,
                        "#B82B13",
                        5,
                        "#B8250C",
                        6,
                        "#B80000",
                        7,
                        "#A9210A",
                        8,
                        "#9F220C",
                        9,
                        "#861B09",
                        10,
                        "#701607",
                        50,
                        "#65180B",
                        100,
                        "#540E03",
                        150,
                        "#3D0C04",
                        200,
                        "#250601",
                    ],
                    "circle-radius": [
                        "step",
                        ["get", "deaths"],
                        0,
                        1,
                        2,
                        2,
                        3,
                        3,
                        4,
                        4,
                        5,
                        5,
                        6,
                        6,
                        7,
                        7,
                        8,
                        8,
                        9,
                        9,
                        10,
                        10,
                        11,
                        11,
                        12,
                        12,
                        13,
                        13,
                        14,
                        14,
                        15,
                        50,
                        20,
                        100,
                        25,
                        200,
                        30,
                        500,
                        35,
                        1000,
                        40,
                    ],
                    "circle-opacity": 0.65,
                },
            });
        });
    }

    convertCoronaData(): void {
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

                    coronaJson.forEach((line) => {
                        line.cases = Number(line.cases);
                        line.deaths = Number(line.deaths);
                    });

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
                                24 +
                            1;
                    });

                    return coronaGeoJson;
                })
            )
            .subscribe((coronaGeoJson: unknown) => {
                console.log("inside subscription", coronaGeoJson);
                this.coronaData$.next(coronaGeoJson);
            });
    }
}
