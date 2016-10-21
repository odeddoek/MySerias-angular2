import { Injectable } from "@angular/core";
import { Show } from "./show";
import { Headers, Http } from "@angular/http";

import "rxjs/add/operator/toPromise";

@Injectable()
export class ShowService {

    private showByIdUrl: string = "http://api.tvmaze.com/shows/";
    private findShowsByNameUrl: string = "http://api.tvmaze.com/search/shows?q=";
    private indexUrl: string = "http://api.tvmaze.com/shows?page=";

    private userShowsUrl: string = "/getShows";

    constructor(private http: Http) { };

    getUserShows() : Promise<number[]> {
        return this.http.get(this.userShowsUrl)
            .toPromise()
            .then(this.getUserShowsData)
            .catch(this.handleError);
    }

    getShowsList(page: number): Promise<Show[]> {
        return this.http.get(this.indexUrl + page)
            .toPromise()
            .then(this.mapShowIndex)
            .catch(this.handleError);
    }

    findShows(name: string): Promise<Show[]> {
        return this.http.get(this.findShowsByNameUrl + name)
            .toPromise().
            then(this.mapShowResults).
            catch(this.handleError);
    }

    getShow(id: number) : Promise<Show> {
        return this.http.get(this.showByIdUrl + id)
            .toPromise()
            .then(this.mapShowResult)
            .catch(this.handleError);
    }

    private getUserShowsData(response: any) : number[] {
        let showsId = response.json();

        return showsId;
    }

    private handleError(error: any): Promise<any> {
        console.error("An error occurred", error);
        return Promise.reject(error.message || error);
    }

    private mapShowIndex(response: any): Show[] {
        let data = response.json();
        var shows: Show[] = [];

        for (var showObject of data) {
            var show: Show = ShowService.mapObjectToShow(showObject);
            shows.push(show);
        }

        return shows;
    }

    private mapShowResults(response: any): Show[] {
        let data = response.json();
        var shows: Show[] = [];

        for (var showObject of data) {
            var show: Show = ShowService.mapObjectToShow(showObject.show);
            shows.push(show);
        }

        return shows;
    }

    private mapShowResult(response: any): Show {
        let data = response.json();
        let show: Show = ShowService.mapObjectToShow(data);
        return show;
    }

    private static mapObjectToShow(data: any): Show {
        var show: Show = new Show();
        show.id = data.id;
        show.name = data.name;
        show.genres = data.genres;
        show.rating = data.rating.average;
        show.summary = data.summary;
        show.premiered = data.premiered;
        return show;
    }
}
