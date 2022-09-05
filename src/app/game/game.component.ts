import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, doc, updateDoc, docData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

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
  gameId!: string;
  game$!: Observable<any>;

  constructor(private route: ActivatedRoute, private firestore: Firestore, public dialog: MatDialog) { }


  ngOnInit(): void {
    this.newGame();
    this.loadGame();
  }


  newGame() {
    this.game = new Game;
    this.visibleStack = this.game.stack.slice(0, this.stackCount);
  }


  loadGame() {
    this.route.params.subscribe(async param => {
      this.gameId = param['id'];
      const docRef = doc(this.firestore, 'games', this.gameId);
      this.game$ = docData(docRef);
      this.game$.subscribe(game => {
        this.game.players = game['players'];
        this.game.stack = game['stack'];
        this.game.playedCards = game['playedCards'];
        this.game.currentPlayer = game['currentPlayer'];
      })
    });
  }


  saveGame() {
    const docRef: any = doc(this.firestore, 'games', this.gameId);
    updateDoc(docRef, this.game.toJson());
  }


  takeCard() {
    this.checkIfPlayer();
    if (!this.pickCardAnimation && this.game.players.length > 0) {
      this.currentCard = this.game.stack.pop();
      this.saveGame();
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
      this.saveGame();
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
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }
}