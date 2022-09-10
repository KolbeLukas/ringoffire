import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-instructions',
  templateUrl: './game-instructions.component.html',
  styleUrls: ['./game-instructions.component.scss']
})
export class GameInstructionsComponent implements OnInit {
  url: string = '';
  display: boolean = false;

  ngOnInit(): void {
    this.url = window.location.href;
  }

  closeInstructions() {
    this.display = true;
  }

  openInstructions() {
    this.display = false;
  }

  stop(event: any) {
    event.stopPropagation();
  }
}
