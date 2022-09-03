import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation: boolean = false;
  currentCard: string | undefined = '';
  game!: Game;
  visibleStack!: string[];
  stackCount: number = 10;
  noCardLeft: boolean = false;
  turn: number = 0;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.newGame();
  }


  newGame() {
    this.game = new Game;
    this.visibleStack = this.game.stack.slice(0, this.stackCount);
  }


  takeCard() {
    this.checkIfPlayer();
    if (!this.pickCardAnimation && this.game.players.length > 0) {
      this.currentCard = this.game.stack.pop();
      this.playAnimation();
      this.updateVisibleStack();
      this.turnPlayedCard();
    }
  }


  checkIfPlayer() {
    if (this.game.players.length > 0) {
      return;
    } else {
      this.openDialog();
    }
  }


  playAnimation() {
    this.pickCardAnimation = true;
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
    setTimeout(() => {
      let currentCard: string = this.currentCard ?? '';
      this.game.playedCards?.push(currentCard);
      this.pickCardAnimation = false;
    }, 1000);
  }


  turnPlayedCard() {
    setTimeout(() => {
      this.turn++
      this.turn = this.turn % 3;
    }, 1000);
  }


  updateVisibleStack() {
    if (this.stackCount >= this.game.stack.length) {
      this.stackCount--;
      this.visibleStack = this.game.stack.slice(0, this.stackCount)
    }
    if (this.stackCount == 0) {
      this.noCardLeft = true;
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name)
      }
    });
  }
}
