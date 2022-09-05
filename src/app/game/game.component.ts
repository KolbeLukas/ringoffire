import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, setDoc, doc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

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
  games$: Observable<any>;

  constructor(private route: ActivatedRoute, private firestore: Firestore, public dialog: MatDialog) {
    const coll = collection(firestore, 'games');
    this.games$ = collectionData(coll);

    this.route.params.subscribe(param => {
      console.log(param['id']);
                                            //PROBLEM beim einbinden des param
    this.games$.subscribe(game => {
      console.log('neues game', game)
    });
  });
  }

  ngOnInit(): void {
    this.newGame();
  }


  newGame() {
    this.game = new Game;
    // const coll = collection(this.firestore, 'games');
    // addDoc(coll, this.game.toJson());
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
