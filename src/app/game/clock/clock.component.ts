import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "bomberman-clock",
    templateUrl: "./clock.component.html",
    styleUrls: ["./clock.component.css"]
})
export class ClockComponent {
    @Input()
    timeInMiliseconds: number;

    getFormattedTime() {
        let minutes = Math.floor(this.timeInMiliseconds / 60000);
        let seconds = Math.floor(this.timeInMiliseconds / 1000) % 60;

        minutes = minutes >= 0 ? minutes : 0;
        seconds = seconds >= 0 ? seconds : 0;
        // Minutes:Seconds
        return `${this.padWithLeadingZeros(minutes)}:${this.padWithLeadingZeros(seconds)}`;
    }

    private padWithLeadingZeros(num: number) {
        return `00${num}`.substr(-2);
    }
}
